/** Serializes accounts to JSON and encrypts them with the auth number as key. */
function dataCryptoEncrypt(accounts, authNumber) {
  try {
    const accountsJson = JSON.stringify(accounts);
    return CryptoJS.AES.encrypt(accountsJson, authNumber).toString();
  } catch (error) {
    console.warn("[data-crypto] dataCryptoEncrypt failed", error);
    throw error;
  }
}

export { dataCryptoEncrypt };
