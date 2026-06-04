/** Returns whether a payload is an AES-encrypted ciphertext string. */
export function dataEncryptedIs(data) {
  try {
    return typeof data === "string" && data.startsWith("U2FsdGVkX1");
  } catch (error) {
    console.warn("[data-crypto] dataEncryptedIs failed", error);
    return false;
  }
}

/** Serializes accounts to JSON and encrypts them with the account number as key. */
export function dataEncrypt(accounts, accountNumber) {
  try {
    const accountsJson = JSON.stringify(accounts);
    return CryptoJS.AES.encrypt(accountsJson, accountNumber).toString();
  } catch (error) {
    console.warn("[data-crypto] dataEncrypt failed", error);
    throw error;
  }
}

/** Decrypts a backup blob and parses the account list inside. */
export function dataDecrypt(encryptedData, accountNumber) {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, accountNumber);
    const accountsJson = decrypted.toString(CryptoJS.enc.Utf8);
    if (!accountsJson) {
      console.warn("[data-crypto] dataDecrypt produced empty plaintext");
    }
    return JSON.parse(accountsJson);
  } catch (error) {
    console.warn("[data-crypto] dataDecrypt failed", error);
    throw error;
  }
}
