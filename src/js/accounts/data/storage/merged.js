import { DATA_KEY_MERGED } from "../constants.js";

/** Runs a storage operation and logs failures. */
async function logWarn(operation, fn) {
  try {
    return await fn();
  } catch (error) {
    console.warn(`[data-storage] ${operation} failed`, error);
    throw error;
  }
}

/** Reads the merged (unencrypted) account list. */
async function dataGetMerged() {
  return logWarn("dataGetMerged", async () => {
    const stored = await chrome.storage.local.get([DATA_KEY_MERGED]);
    return stored[DATA_KEY_MERGED];
  });
}

/** Writes the merged (unencrypted) account list. */
async function dataSetMerged(accounts) {
  return logWarn("dataSetMerged", () =>
    chrome.storage.local.set({ [DATA_KEY_MERGED]: accounts }),
  );
}

/** Clears the merged account list. */
async function dataClearMerged() {
  return logWarn("dataClearMerged", () =>
    chrome.storage.local.remove([DATA_KEY_MERGED]),
  );
}

export { dataGetMerged };
export { dataSetMerged };
export { dataClearMerged };
