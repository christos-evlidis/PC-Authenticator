import { dataApiRestore } from "../data-api.js";
import { dataCryptoIsEncrypted } from "../crypto/data-crypto-type.js";
import { dataStorageClearEncrypted } from "../storage/data-storage-encrypted.js";
import { dataStorageSetEncrypted } from "../storage/data-storage-encrypted.js";
import { dataStorageClearMerged } from "../storage/data-storage-merged.js";

/** Fetches cloud backup and caches the encrypted blob locally when applicable. */
export async function dataRestore(accountNumber) {
  let result;
  try {
    result = await dataApiRestore(accountNumber);
  } catch (error) {
    console.warn("[data-backup] dataRestore fetch failed", error);
    throw error;
  }
  try {
    if (
      typeof result.accounts === "string" &&
      dataCryptoIsEncrypted(result.accounts)
    ) {
      await dataStorageSetEncrypted(result.accounts);
    } else {
      await dataStorageClearEncrypted();
      await dataStorageClearMerged();
    }
  } catch (error) {
    console.warn("[data-backup] dataRestore cache update failed", error);
    throw error;
  }
  return result;
}
