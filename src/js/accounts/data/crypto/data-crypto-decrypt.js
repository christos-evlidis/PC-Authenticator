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
