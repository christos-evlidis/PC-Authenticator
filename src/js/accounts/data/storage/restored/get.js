import { DATA_KEY_RESTORED } from "../../../constants.js";

/** Reads the decrypted cloud restore cache. */
async function dataStorageRestoredGet() {
  try {
    const stored = await chrome.storage.local.get([DATA_KEY_RESTORED]);
    return stored[DATA_KEY_RESTORED];
  } catch (error) {
    console.warn("[data-storage] dataStorageRestoredGet failed", error);
    throw error;
  }
}

export { dataStorageRestoredGet };
