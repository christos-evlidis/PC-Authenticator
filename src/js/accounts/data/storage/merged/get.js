import { DATA_KEY_MERGED } from "../../../constants.js";

/** Reads the merged (unencrypted) account list. */
async function dataStorageMergedGet() {
  try {
    const stored = await chrome.storage.local.get([DATA_KEY_MERGED]);
    return stored[DATA_KEY_MERGED];
  } catch (error) {
    console.warn("[data-storage] dataStorageMergedGet failed", error);
    throw error;
  }
}

export { dataStorageMergedGet };
