import { DATA_KEY_FINAL } from "../constants.js";

/** Runs a storage operation and logs failures. */
async function logWarn(operation, fn) {
  try {
    return await fn();
  } catch (error) {
    console.warn(`[data-storage] ${operation} failed`, error);
    throw error;
  }
}

/** Reads the final (active) account list from local storage. */
async function dataGet() {
  return logWarn("dataGet", async () => {
    const stored = await chrome.storage.local.get([DATA_KEY_FINAL]);
    return stored[DATA_KEY_FINAL];
  });
}

/** Writes the final (active) account list to local storage. */
async function dataSet(accounts) {
  return logWarn("dataSet", () =>
    chrome.storage.local.set({ [DATA_KEY_FINAL]: accounts }),
  );
}

/** Clears the final (active) account list from local storage. */
async function dataClear() {
  return logWarn("dataClear", () =>
    chrome.storage.local.remove([DATA_KEY_FINAL]),
  );
}

export { dataGet };
export { dataSet };
export { dataClear };
