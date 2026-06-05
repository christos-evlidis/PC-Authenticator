import { DATA_KEY_ENCRYPTED } from "../data-constants.js";
import { dataStorageLogWarn } from "./data-storage-log.js";

/** Reads the cached encrypted backup blob. */
export async function dataStorageGetEncrypted() {
  return dataStorageLogWarn("dataStorageGetEncrypted", async () => {
    const stored = await chrome.storage.local.get([DATA_KEY_ENCRYPTED]);
    return stored[DATA_KEY_ENCRYPTED];
  });
}

/** Writes the cached encrypted backup blob. */
export async function dataStorageSetEncrypted(encryptedBlob) {
  return dataStorageLogWarn("dataStorageSetEncrypted", () =>
    chrome.storage.local.set({ [DATA_KEY_ENCRYPTED]: encryptedBlob }),
  );
}

/** Clears the cached encrypted backup blob. */
export async function dataStorageClearEncrypted() {
  return dataStorageLogWarn("dataStorageClearEncrypted", () =>
    chrome.storage.local.remove([DATA_KEY_ENCRYPTED]),
  );
}
