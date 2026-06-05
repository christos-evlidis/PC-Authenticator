import { DATA_KEY_FINAL } from "../data-constants.js";

/** Runs a storage operation and logs failures. */
async function dataStorageLogWarn(operation, fn) {
  try {
    return await fn();
  } catch (error) {
    console.warn(`[data-storage] ${operation} failed`, error);
    throw error;
  }
}

/** Reads the final (active) account list from local storage. */
async function dataStorageGetFinal() {
  return dataStorageLogWarn("dataStorageGetFinal", async () => {
    const stored = await chrome.storage.local.get([DATA_KEY_FINAL]);
    return stored[DATA_KEY_FINAL];
  });
}

/** Writes the final (active) account list to local storage. */
async function dataStorageSetFinal(accounts) {
  return dataStorageLogWarn("dataStorageSetFinal", () =>
    chrome.storage.local.set({ [DATA_KEY_FINAL]: accounts }),
  );
}

/** Clears the final (active) account list from local storage. */
async function dataStorageClearFinal() {
  return dataStorageLogWarn("dataStorageClearFinal", () =>
    chrome.storage.local.remove([DATA_KEY_FINAL]),
  );
}

export { dataStorageGetFinal };
export { dataStorageSetFinal };
export { dataStorageClearFinal };
