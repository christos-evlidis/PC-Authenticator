import { DATA_KEY_RESTORED } from "../../../constants.js";

/** Clears the decrypted cloud restore cache. */
async function dataStorageRestoredClear() {
  try {
    await chrome.storage.local.remove([DATA_KEY_RESTORED]);
  } catch (error) {
    console.warn("[data-storage] dataStorageRestoredClear failed", error);
    throw error;
  }
}

export { dataStorageRestoredClear };
