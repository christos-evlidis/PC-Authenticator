window.AccountsStorage = {
    ACCOUNTS_ALL_KEY: 'accountsAll',
    ACCOUNTS_ENCRYPTED_KEY: 'accountsEncrypted',
    ACCOUNTS_UNENCRYPTED_KEY: 'accountsUnencrypted',
    ACCOUNTS_MERGED_KEY: 'accountsMerged',

    /**
     * Merge incoming accounts into base while keeping base order.
     * New accounts are prepended (newest first), matching the codes list UI.
     * Existing ids are updated in place.
     */
    mergeAccountsPreserveOrder(baseList, incomingList) {
        const base = Array.isArray(baseList) ? [...baseList] : [];
        const incoming = Array.isArray(incomingList) ? incomingList : [];
        const indexById = new Map();

        base.forEach((account, index) => {
            if (account?.id != null) {
                indexById.set(String(account.id), index);
            }
        });

        const toPrepend = [];

        for (const account of incoming) {
            if (account?.id == null) {
                continue;
            }

            const id = String(account.id);

            if (indexById.has(id)) {
                base[indexById.get(id)] = account;
            } else {
                toPrepend.push(account);
            }
        }

        return [...toPrepend.reverse(), ...base];
    },

    async restoreAccounts(accountNumber) {
        const result = await window.PcAuthApi.restoreAccounts(accountNumber);

        if (
            result
            && !result.noBackup
            && typeof result.accounts === 'string'
            && window.AccountsCrypto?.isEncryptedData(result.accounts)
        ) {
            await chrome.storage.local.set({
                [this.ACCOUNTS_ENCRYPTED_KEY]: result.accounts
            });
        } else {
            await this.clearEncryptedAccounts();
        }

        return result;
    },

    async decryptAccounts(accountNumber) {
        const stored = await chrome.storage.local.get([this.ACCOUNTS_ENCRYPTED_KEY]);
        const encryptedBlob = stored[this.ACCOUNTS_ENCRYPTED_KEY];

        if (!encryptedBlob || !window.AccountsCrypto?.isEncryptedData(encryptedBlob)) {
            return [];
        }

        return window.AccountsCrypto.decryptAccounts(encryptedBlob, accountNumber);
    },

    async mergeAccounts(accountNumber) {
        const restoredPlain = await this.decryptAccounts(accountNumber);
        const stored = await chrome.storage.local.get([this.ACCOUNTS_UNENCRYPTED_KEY]);
        const pending = Array.isArray(stored[this.ACCOUNTS_UNENCRYPTED_KEY])
            ? stored[this.ACCOUNTS_UNENCRYPTED_KEY]
            : [];
        let base = restoredPlain;

        if (!base.length) {
            base = await this.getAccountsAll();
        }

        const merged = this.mergeAccountsPreserveOrder(base, pending);

        await chrome.storage.local.set({
            [this.ACCOUNTS_MERGED_KEY]: merged,
            [this.ACCOUNTS_ALL_KEY]: merged
        });

        return merged;
    },

    async backupAccounts(accountNumber) {
        const stored = await chrome.storage.local.get([this.ACCOUNTS_MERGED_KEY]);
        const merged = Array.isArray(stored[this.ACCOUNTS_MERGED_KEY])
            ? stored[this.ACCOUNTS_MERGED_KEY]
            : [];

        if (!merged.length) {
            throw new Error('No merged accounts to back up.');
        }

        const encryptedPayload = window.AccountsCrypto.encryptAccounts(merged, accountNumber);
        await window.PcAuthApi.backupAccounts(accountNumber, encryptedPayload);
    },

    async clearEncryptedAccounts() {
        await chrome.storage.local.remove([this.ACCOUNTS_ENCRYPTED_KEY]);
    },

    async clearDecryptedAccounts() {
        await chrome.storage.local.remove([this.ACCOUNTS_UNENCRYPTED_KEY]);
    },

    async clearMergedAccounts() {
        await chrome.storage.local.remove([this.ACCOUNTS_MERGED_KEY]);
    },

    async clearAllAccounts() {
        await chrome.storage.local.remove([
            this.ACCOUNTS_ALL_KEY,
            this.ACCOUNTS_ENCRYPTED_KEY,
            this.ACCOUNTS_UNENCRYPTED_KEY,
            this.ACCOUNTS_MERGED_KEY,
            'accountsRestore',
            'accounts',
            'encrypted'
        ]);
    },

    async setAccountsAll(accountNumber) {
        const result = await this.restoreAccounts(accountNumber);

        if (!result || result.noBackup || result.accounts == null) {
            await chrome.storage.local.set({ [this.ACCOUNTS_ALL_KEY]: [] });
            await this.clearEncryptedAccounts();
            await this.clearDecryptedAccounts();
            await this.clearMergedAccounts();
            return [];
        }

        let plainAccounts = [];

        if (typeof result.accounts === 'string' && window.AccountsCrypto?.isEncryptedData(result.accounts)) {
            plainAccounts = await this.decryptAccounts(accountNumber);
        } else if (Array.isArray(result.accounts)) {
            plainAccounts = result.accounts;
        }

        const pendingStored = await chrome.storage.local.get([this.ACCOUNTS_UNENCRYPTED_KEY]);
        const pending = Array.isArray(pendingStored[this.ACCOUNTS_UNENCRYPTED_KEY])
            ? pendingStored[this.ACCOUNTS_UNENCRYPTED_KEY]
            : [];

        if (pending.length) {
            plainAccounts = this.mergeAccountsPreserveOrder(plainAccounts, pending);
        }

        await chrome.storage.local.set({ [this.ACCOUNTS_ALL_KEY]: plainAccounts });
        await this.clearEncryptedAccounts();
        await this.clearDecryptedAccounts();
        await this.clearMergedAccounts();
        return plainAccounts;
    },

    async getAccountsAll() {
        const stored = await chrome.storage.local.get([this.ACCOUNTS_ALL_KEY]);
        const accounts = stored[this.ACCOUNTS_ALL_KEY];
        return Array.isArray(accounts) ? accounts : [];
    },

    async appendAccountUnencrypted(account) {
        const stored = await chrome.storage.local.get([this.ACCOUNTS_UNENCRYPTED_KEY]);
        const pending = Array.isArray(stored[this.ACCOUNTS_UNENCRYPTED_KEY])
            ? stored[this.ACCOUNTS_UNENCRYPTED_KEY]
            : [];

        await chrome.storage.local.set({
            [this.ACCOUNTS_UNENCRYPTED_KEY]: [...pending, account]
        });
    },

    buildAccountRecord({ name, secret, email, algorithm, digits, period, type, counter }) {
        const otpType = type ?? window.AccountsOtpauth.TOTP_TYPE;
        const account = {
            id: String(Date.now()),
            name,
            secret,
            type: otpType,
            algorithm: algorithm ?? window.AccountsOtpauth.DEFAULT_ALGORITHM,
            digits: digits ?? window.AccountsOtpauth.TOTP_DIGITS
        };

        if (otpType === window.AccountsOtpauth.HOTP_TYPE) {
            account.counter = Number.isInteger(counter)
                ? counter
                : window.AccountsOtpauth.HOTP_DEFAULT_COUNTER;
        } else {
            account.period = period ?? window.AccountsOtpauth.TOTP_PERIOD;
        }

        if (email) {
            account.email = email;
        }

        return account;
    },

    async incrementHotpCounter(accountNumber, accountId) {
        if (!accountNumber) {
            throw new Error('Sign in to update accounts.');
        }

        if (accountId == null) {
            throw new Error('Account id is required.');
        }

        const updateId = String(accountId);

        await this.restoreAccounts(accountNumber);

        let decrypted = await this.decryptAccounts(accountNumber);

        if (!decrypted.length) {
            decrypted = await this.getAccountsAll();
        }

        const index = decrypted.findIndex((account) => String(account?.id) === updateId);

        if (index === -1) {
            throw new Error('Account not found.');
        }

        const account = decrypted[index];

        if ((account.type ?? window.AccountsOtpauth.TOTP_TYPE) !== window.AccountsOtpauth.HOTP_TYPE) {
            throw new Error('Not a HOTP account.');
        }

        account.counter = (Number.isInteger(account.counter) ? account.counter : 0) + 1;

        const encryptedPayload = window.AccountsCrypto.encryptAccounts(decrypted, accountNumber);
        await window.PcAuthApi.backupAccounts(accountNumber, encryptedPayload);

        await this.clearEncryptedAccounts();
        await this.clearDecryptedAccounts();
        await this.clearMergedAccounts();

        await this.setAccountsAll(accountNumber);

        return account.counter;
    },

    async handleQrAdd(accountNumber, otpauthUri) {
        if (!accountNumber) {
            throw new Error('Sign in to add accounts.');
        }

        const parsed = window.AccountsOtpauth.parseQRCodeAccountInput(otpauthUri);
        const account = this.buildAccountRecord(parsed);

        await this.appendAccountUnencrypted(account);

        return account;
    },

    async handleDelete(accountNumber, accountId) {
        if (!accountNumber) {
            throw new Error('Sign in to delete accounts.');
        }

        if (accountId == null) {
            throw new Error('Account id is required.');
        }

        const deleteId = String(accountId);

        await this.restoreAccounts(accountNumber);

        let decrypted = await this.decryptAccounts(accountNumber);

        if (!decrypted.length) {
            decrypted = await this.getAccountsAll();
        }

        const filtered = decrypted.filter((account) => String(account?.id) !== deleteId);

        if (filtered.length === decrypted.length) {
            throw new Error('Account not found.');
        }

        const encryptedPayload = window.AccountsCrypto.encryptAccounts(filtered, accountNumber);
        await window.PcAuthApi.backupAccounts(accountNumber, encryptedPayload);

        await this.clearEncryptedAccounts();
        await this.clearDecryptedAccounts();
        await this.clearMergedAccounts();

        return this.setAccountsAll(accountNumber);
    },

    async handleUpdate(accountNumber, accountId, patch) {
        if (!accountNumber) {
            throw new Error('Sign in to update accounts.');
        }

        if (accountId == null) {
            throw new Error('Account id is required.');
        }

        const updateId = String(accountId);

        await this.restoreAccounts(accountNumber);

        let decrypted = await this.decryptAccounts(accountNumber);

        if (!decrypted.length) {
            decrypted = await this.getAccountsAll();
        }

        const index = decrypted.findIndex((account) => String(account?.id) === updateId);

        if (index === -1) {
            throw new Error('Account not found.');
        }

        const account = decrypted[index];

        if (patch.name != null) {
            account.name = patch.name;
        }

        if (patch.email !== undefined) {
            account.email = patch.email;
        }

        if (patch.username !== undefined) {
            account.username = patch.username;
        }

        if (patch.counter != null) {
            const counter = Number.parseInt(patch.counter, 10);

            if (
                !Number.isInteger(counter)
                || counter < window.AccountsOtpauth.MIN_COUNTER
            ) {
                throw new Error('Invalid HOTP counter.');
            }

            account.counter = counter;
        }

        const encryptedPayload = window.AccountsCrypto.encryptAccounts(decrypted, accountNumber);
        await window.PcAuthApi.backupAccounts(accountNumber, encryptedPayload);

        await this.clearEncryptedAccounts();
        await this.clearDecryptedAccounts();
        await this.clearMergedAccounts();

        return this.setAccountsAll(accountNumber);
    },

    async handleSync(accountNumber) {
        if (!accountNumber) {
            throw new Error('Sign in to back up accounts.');
        }

        const stored = await chrome.storage.local.get([this.ACCOUNTS_UNENCRYPTED_KEY]);
        const pending = Array.isArray(stored[this.ACCOUNTS_UNENCRYPTED_KEY])
            ? stored[this.ACCOUNTS_UNENCRYPTED_KEY]
            : [];

        if (!pending.length) {
            throw new Error('No pending accounts to back up.');
        }

        await this.restoreAccounts(accountNumber);
        await this.mergeAccounts(accountNumber);
        await this.clearEncryptedAccounts();
        await this.clearDecryptedAccounts();
        await this.backupAccounts(accountNumber);
        await this.clearMergedAccounts();

        return this.setAccountsAll(accountNumber);
    }
};
