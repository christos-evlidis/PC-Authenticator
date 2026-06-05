/** Returns whether a payload is an AES-encrypted ciphertext string. */
export function dataCryptoIsEncrypted(data) {
  try {
    return typeof data === "string" && data.startsWith("U2FsdGVkX1");
  } catch (error) {
    console.warn("[data-crypto] dataCryptoIsEncrypted failed", error);
    return false;
  }
}
