window.AccountsCrypto = {
    isAvailable() {
        return typeof CryptoJS !== 'undefined' && Boolean(CryptoJS.AES);
    },

    isEncryptedData(data) {
        return typeof data === 'string' && data.startsWith('U2FsdGVkX1');
    },

    encryptAccounts(accounts, accountNumber) {
        if (!this.isAvailable()) {
            throw new Error('CryptoJS library not available');
        }

        if (!Array.isArray(accounts) || accounts.length === 0) {
            throw new Error('Cannot encrypt empty accounts array');
        }

        const accountsJson = JSON.stringify(accounts);
        return CryptoJS.AES.encrypt(accountsJson, accountNumber).toString();
    },

    decryptAccounts(encryptedData, accountNumber) {
        if (!this.isAvailable()) {
            throw new Error('CryptoJS library not available');
        }

        const decrypted = CryptoJS.AES.decrypt(encryptedData, accountNumber);
        const accountsJson = decrypted.toString(CryptoJS.enc.Utf8);

        if (!accountsJson) {
            throw new Error('Failed to decrypt accounts');
        }

        const accounts = JSON.parse(accountsJson);
        return Array.isArray(accounts) ? accounts : [];
    }
};
