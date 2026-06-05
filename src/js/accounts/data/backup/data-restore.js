import { dataApiRestore } from "../data-api.js";
import { dataCryptoIsEncrypted } from "../data-crypto.js";
import { dataStorageClearEncrypted } from "../data-storage.js";
import { dataStorageSetEncrypted } from "../data-storage.js";
import { dataStorageClearMerged } from "../data-storage.js";

/** Fetches cloud backup and caches the encrypted blob locally when applicable. */
export async function dataBackupRestore(accountNumber) {
  let result = { accounts: null };
  try {
    result = await dataApiRestore(accountNumber);
  } catch (error) {
    console.warn("[data-backup] dataBackupRestore fetch failed", error);
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
    console.warn("[data-backup] dataBackupRestore cache update failed", error);
    throw error;
  }
  return result;
}
