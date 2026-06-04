/** Returns whether a payload is an AES-encrypted ciphertext string. */
export function accountEncryptedIs(data) {
  try {
    return typeof data === "string" && data.startsWith("U2FsdGVkX1");
  } catch (error) {
    console.warn("[account-crypto] accountEncryptedIs failed", error);
    return false;
  }
}

/** Serializes accounts to JSON and encrypts them with the account number as key. */
export function accountEncrypt(accounts, accountNumber) {
  try {
    const accountsJson = JSON.stringify(accounts);
    return CryptoJS.AES.encrypt(accountsJson, accountNumber).toString();
  } catch (error) {
    console.warn("[account-crypto] accountEncrypt failed", error);
    throw error;
  }
}

/** Decrypts a backup blob and parses the account list inside. */
export function accountDecrypt(encryptedData, accountNumber) {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, accountNumber);
    const accountsJson = decrypted.toString(CryptoJS.enc.Utf8);
    if (!accountsJson) {
      console.warn("[account-crypto] accountDecrypt produced empty plaintext");
    }
    return JSON.parse(accountsJson);
  } catch (error) {
    console.warn("[account-crypto] accountDecrypt failed", error);
    throw error;
  }
}
