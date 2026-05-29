window.PcAuthApi = {
    baseUrl: 'https://pc-authenticator-pdpy.onrender.com/api',

    async verifyAccount(accountNumber) {
        const response = await fetch(`${this.baseUrl}/verify-account`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ account_number: accountNumber })
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.error || 'Sign in failed. Please try again.');
        }

        return data;
    },

    async createAccount() {
        const response = await fetch(`${this.baseUrl}/create-account`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.error || 'Sign up failed. Please try again.');
        }

        if (!data.account_number) {
            throw new Error('Sign up failed. Please try again.');
        }

        return data.account_number;
    },

    async restoreAccounts(accountNumber) {
        const response = await fetch(`${this.baseUrl}/restore-accounts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ account_number: accountNumber })
        });

        const data = await response.json().catch(() => ({}));

        if (data.success === false && data.error === 'No backup found') {
            return { noBackup: true, accounts: null };
        }

        if (!response.ok || !data.success) {
            throw new Error(data.error || 'Failed to restore accounts.');
        }

        return { noBackup: false, accounts: data.accounts };
    },

    async backupAccounts(accountNumber, encryptedAccounts) {
        if (!accountNumber || typeof accountNumber !== 'string' || !accountNumber.trim()) {
            throw new Error('Invalid account number.');
        }

        if (Array.isArray(encryptedAccounts)) {
            throw new Error('Cannot back up unencrypted account data.');
        }

        if (typeof encryptedAccounts !== 'string' || !encryptedAccounts.trim()) {
            throw new Error('Cannot back up empty account data.');
        }

        const isEncrypted = window.AccountsCrypto?.isEncryptedData
            ? window.AccountsCrypto.isEncryptedData(encryptedAccounts)
            : encryptedAccounts.startsWith('U2FsdGVkX1');

        if (!isEncrypted) {
            throw new Error('Backup data must be encrypted.');
        }

        const response = await fetch(`${this.baseUrl}/backup-accounts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                account_number: accountNumber,
                accounts: encryptedAccounts,
                encrypted: true
            })
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data.success) {
            throw new Error(data.error || 'Failed to back up accounts.');
        }

        return data;
    }
};
