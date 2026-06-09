import { DATA_KEY_MERGED } from "../../../constants.js";

/** Clears the merged account list. */
async function dataStorageMergedClear() {
  try {
    await chrome.storage.local.remove([DATA_KEY_MERGED]);
  } catch (error) {
    console.warn("[data-storage] dataStorageMergedClear failed", error);
    throw error;
  }
}

export { dataStorageMergedClear };
