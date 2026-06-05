import { DATA_KEY_MERGED } from "../data-constants.js";

/** Runs a storage operation and logs failures. */
async function dataStorageLogWarn(operation, fn) {
  try {
    return await fn();
  } catch (error) {
    console.warn(`[data-storage] ${operation} failed`, error);
    throw error;
  }
}

/** Reads the temporary merged list used during add/sync flows. */
async function dataStorageGetMerged() {
  return dataStorageLogWarn("dataStorageGetMerged", async () => {
    const stored = await chrome.storage.local.get([DATA_KEY_MERGED]);
    return stored[DATA_KEY_MERGED];
  });
}

/** Writes the temporary merged list. */
async function dataStorageSetMerged(accounts) {
  return dataStorageLogWarn("dataStorageSetMerged", () =>
    chrome.storage.local.set({ [DATA_KEY_MERGED]: accounts }),
  );
}

/** Clears the temporary merged list. */
async function dataStorageClearMerged() {
  return dataStorageLogWarn("dataStorageClearMerged", () =>
    chrome.storage.local.remove([DATA_KEY_MERGED]),
  );
}

export { dataStorageGetMerged };
export { dataStorageSetMerged };
export { dataStorageClearMerged };
