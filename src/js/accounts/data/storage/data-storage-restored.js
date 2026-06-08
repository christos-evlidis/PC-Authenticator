import { DATA_KEY_RESTORED } from "../data-constants.js";

/** Runs a storage operation and logs failures. */
async function dataStorageLogWarn(operation, fn) {
  try {
    return await fn();
  } catch (error) {
    console.warn(`[data-storage] ${operation} failed`, error);
    throw error;
  }
}

/** Reads the decrypted cloud restore cache. */
async function dataStorageGetRestored() {
  return dataStorageLogWarn("dataStorageGetRestored", async () => {
    const stored = await chrome.storage.local.get([DATA_KEY_RESTORED]);
    return stored[DATA_KEY_RESTORED];
  });
}

/** Writes the decrypted cloud restore cache. */
async function dataStorageSetRestored(accounts) {
  return dataStorageLogWarn("dataStorageSetRestored", () =>
    chrome.storage.local.set({ [DATA_KEY_RESTORED]: accounts }),
  );
}

/** Clears the decrypted cloud restore cache. */
async function dataStorageClearRestored() {
  return dataStorageLogWarn("dataStorageClearRestored", () =>
    chrome.storage.local.remove([DATA_KEY_RESTORED]),
  );
}

export { dataStorageGetRestored };
export { dataStorageSetRestored };
export { dataStorageClearRestored };
