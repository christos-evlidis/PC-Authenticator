import { DATA_KEY_RESTORED } from "../../../constants.js";

/** Writes the decrypted cloud restore cache. */
async function dataStorageRestoredSet(accounts) {
  try {
    await chrome.storage.local.set({ [DATA_KEY_RESTORED]: accounts });
  } catch (error) {
    console.warn("[data-storage] dataStorageRestoredSet failed", error);
    throw error;
  }
}

export { dataStorageRestoredSet };
