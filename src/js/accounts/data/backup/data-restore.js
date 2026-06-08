import { dataApiRestore } from "../data-api.js";
import { dataCryptoDecrypt } from "../crypto/data-crypto-decrypt.js";
import { dataCryptoIsEncrypted } from "../crypto/data-crypto-type.js";
import { dataSanitizeList } from "../records/data-sanitize.js";
import { dataStorageClearRestored } from "../storage/data-storage-restored.js";
import { dataStorageSetRestored } from "../storage/data-storage-restored.js";

/** Fetches cloud backup, decrypts when needed, and caches under dataRestored. */
async function dataRestore(authNumber) {
  let result;
  try {
    result = await dataApiRestore(authNumber);
  } catch (error) {
    console.warn("[data-backup] dataRestore fetch failed", error);
    throw error;
  }
  try {
    if (result.accounts == null) {
      await dataStorageClearRestored();
    } else if (
      typeof result.accounts === "string" &&
      dataCryptoIsEncrypted(result.accounts)
    ) {
      try {
        const decrypted = dataSanitizeList(
          dataCryptoDecrypt(result.accounts, authNumber),
        );
        await dataStorageSetRestored(decrypted);
      } catch (error) {
        console.warn("[data-backup] dataRestore decrypt failed", error);
        await dataStorageClearRestored();
        throw error;
      }
    } else {
      await dataStorageSetRestored(
        dataSanitizeList(result.accounts),
      );
    }
  } catch (error) {
    console.warn("[data-backup] dataRestore cache update failed", error);
    throw error;
  }
  return result;
}

export { dataRestore };
