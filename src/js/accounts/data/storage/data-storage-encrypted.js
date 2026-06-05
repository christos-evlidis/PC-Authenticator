import { DATA_KEY_ENCRYPTED } from "../data-constants.js";

/** Runs a storage operation and logs failures. */
async function dataStorageLogWarn(operation, fn) {
  try {
    return await fn();
  } catch (error) {
    console.warn(`[data-storage] ${operation} failed`, error);
    throw error;
  }
}

/** Reads the cached encrypted backup blob. */
async function dataStorageGetEncrypted() {
  return dataStorageLogWarn("dataStorageGetEncrypted", async () => {
    const stored = await chrome.storage.local.get([DATA_KEY_ENCRYPTED]);
    return stored[DATA_KEY_ENCRYPTED];
  });
}

/** Writes the cached encrypted backup blob. */
async function dataStorageSetEncrypted(encryptedBlob) {
  return dataStorageLogWarn("dataStorageSetEncrypted", () =>
    chrome.storage.local.set({ [DATA_KEY_ENCRYPTED]: encryptedBlob }),
  );
}

/** Clears the cached encrypted backup blob. */
async function dataStorageClearEncrypted() {
  return dataStorageLogWarn("dataStorageClearEncrypted", () =>
    chrome.storage.local.remove([DATA_KEY_ENCRYPTED]),
  );
}

export { dataStorageGetEncrypted };
export { dataStorageSetEncrypted };
export { dataStorageClearEncrypted };
