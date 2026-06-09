/** Decrypts a dataBackup blob and parses the account list inside. */
function dataCryptoDecrypt(encryptedData, authNumber) {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, authNumber);
    const accountsJson = decrypted.toString(CryptoJS.enc.Utf8);
    if (!accountsJson) {
      console.warn("[data-crypto] decrypt produced empty plaintext");
    }
    return JSON.parse(accountsJson);
  } catch (error) {
    console.warn("[data-crypto] decrypt failed", error);
    throw error;
  }
}

export { dataCryptoDecrypt };
