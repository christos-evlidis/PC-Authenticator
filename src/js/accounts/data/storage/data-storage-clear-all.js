import { DATA_KEY_LEGACY } from "../data-constants.js";
import { dataStorageLogWarn } from "./data-storage-log.js";
import { dataStorageClearEncrypted } from "./data-storage-encrypted.js";
import { dataStorageClearFinal } from "./data-storage-final.js";
import { dataStorageClearMerged } from "./data-storage-merged.js";
import { dataStorageClearPending } from "./data-storage-pending.js";

/** Clears all account-related keys from local storage (sign-out / reset). */
export async function dataStorageClearAll() {
  return dataStorageLogWarn("dataStorageClearAll", async () => {
    await dataStorageClearFinal();
    await dataStorageClearEncrypted();
    await dataStorageClearPending();
    await dataStorageClearMerged();
    await chrome.storage.local.remove(DATA_KEY_LEGACY);
  });
}
