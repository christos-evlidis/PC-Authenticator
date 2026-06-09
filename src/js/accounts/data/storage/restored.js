import { DATA_KEY_RESTORED } from "../constants.js";

/** Runs a storage operation and logs failures. */
async function logWarn(operation, fn) {
  try {
    return await fn();
  } catch (error) {
    console.warn(`[data-storage] ${operation} failed`, error);
    throw error;
  }
}

/** Reads the decrypted cloud dataRestore cache. */
async function dataGetRestored() {
  return logWarn("dataGetRestored", async () => {
    const stored = await chrome.storage.local.get([DATA_KEY_RESTORED]);
    return stored[DATA_KEY_RESTORED];
  });
}

/** Writes the decrypted cloud dataRestore cache. */
async function dataSetRestored(accounts) {
  return logWarn("dataSetRestored", () =>
    chrome.storage.local.set({ [DATA_KEY_RESTORED]: accounts }),
  );
}

/** Clears the decrypted cloud dataRestore cache. */
async function dataClearRestored() {
  return logWarn("dataClearRestored", () =>
    chrome.storage.local.remove([DATA_KEY_RESTORED]),
  );
}

export { dataGetRestored };
export { dataSetRestored };
export { dataClearRestored };
