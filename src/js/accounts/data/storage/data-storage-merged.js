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

/** Reads the merged (unencrypted) account list. */
async function dataStorageGetMerged() {
  return dataStorageLogWarn("dataStorageGetMerged", async () => {
    const stored = await chrome.storage.local.get([DATA_KEY_MERGED]);
    return stored[DATA_KEY_MERGED];
  });
}

/** Writes the merged (unencrypted) account list. */
async function dataStorageSetMerged(accounts) {
  return dataStorageLogWarn("dataStorageSetMerged", () =>
    chrome.storage.local.set({ [DATA_KEY_MERGED]: accounts }),
  );
}

/** Clears the merged account list. */
async function dataStorageClearMerged() {
  return dataStorageLogWarn("dataStorageClearMerged", () =>
    chrome.storage.local.remove([DATA_KEY_MERGED]),
  );
}

export { dataStorageGetMerged };
export { dataStorageSetMerged };
export { dataStorageClearMerged };
