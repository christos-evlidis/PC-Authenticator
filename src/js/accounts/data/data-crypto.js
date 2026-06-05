/** Returns whether a payload is an AES-encrypted ciphertext string. */
export function dataCryptoIsEncrypted(data) {
  try {
    return typeof data === "string" && data.startsWith("U2FsdGVkX1");
  } catch (error) {
    console.warn("[data-crypto] dataCryptoIsEncrypted failed", error);
    return false;
  }
}

/** Serializes accounts to JSON and encrypts them with the account number as key. */
export function dataCryptoEncrypt(accounts, accountNumber) {
  try {
    const accountsJson = JSON.stringify(accounts);
    return CryptoJS.AES.encrypt(accountsJson, accountNumber).toString();
  } catch (error) {
    console.warn("[data-crypto] dataCryptoEncrypt failed", error);
    throw error;
  }
}

/** Decrypts a backup blob and parses the account list inside. */
export function dataCryptoDecrypt(encryptedData, accountNumber) {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, accountNumber);
    const accountsJson = decrypted.toString(CryptoJS.enc.Utf8);
    if (!accountsJson) {
      console.warn("[data-crypto] dataCryptoDecrypt produced empty plaintext");
    }
    return JSON.parse(accountsJson);
  } catch (error) {
    console.warn("[data-crypto] dataCryptoDecrypt failed", error);
    throw error;
  }
}
