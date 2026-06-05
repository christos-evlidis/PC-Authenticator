import { dataStorageClearEncrypted } from "./data-storage-encrypted.js";
import { dataStorageClearFinal } from "./data-storage-final.js";
import { dataStorageClearMerged } from "./data-storage-merged.js";
import { dataStorageClearPending } from "./data-storage-pending.js";

import { DATA_KEY_LEGACY } from "../data-constants.js";

/** Runs a storage operation and logs failures. */
async function dataStorageLogWarn(operation, fn) {
  try {
    return await fn();
  } catch (error) {
    console.warn(`[data-storage] ${operation} failed`, error);
    throw error;
  }
}

/** Clears all account-related keys from local storage (sign-out / reset). */
async function dataStorageClearAll() {
  return dataStorageLogWarn("dataStorageClearAll", async () => {
    await dataStorageClearFinal();
    await dataStorageClearEncrypted();
    await dataStorageClearPending();
    await dataStorageClearMerged();
    await chrome.storage.local.remove(DATA_KEY_LEGACY);
  });
}

export { dataStorageClearAll };
