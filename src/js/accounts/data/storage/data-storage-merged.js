import { DATA_KEY_MERGED } from "../data-constants.js";

async function dataStorageLogWarn(operation, fn) {
  try {
    return await fn();
  } catch (error) {
    console.warn(`[data-storage] ${operation} failed`, error);
    throw error;
  }
}

/** Reads the temporary merged list used during add/sync flows. */
export async function dataStorageGetMerged() {
  return dataStorageLogWarn("dataStorageGetMerged", async () => {
    const stored = await chrome.storage.local.get([DATA_KEY_MERGED]);
    return stored[DATA_KEY_MERGED];
  });
}

/** Writes the temporary merged list. */
export async function dataStorageSetMerged(accounts) {
  return dataStorageLogWarn("dataStorageSetMerged", () =>
    chrome.storage.local.set({ [DATA_KEY_MERGED]: accounts }),
  );
}

/** Clears the temporary merged list. */
export async function dataStorageClearMerged() {
  return dataStorageLogWarn("dataStorageClearMerged", () =>
    chrome.storage.local.remove([DATA_KEY_MERGED]),
  );
}
