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
