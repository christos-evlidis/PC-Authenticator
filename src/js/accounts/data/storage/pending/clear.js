import { DATA_KEY_PENDING } from "../../../constants.js";

/** Clears the pending accounts queue. */
async function dataStoragePendingClear() {
  try {
    await chrome.storage.local.remove([DATA_KEY_PENDING]);
  } catch (error) {
    console.warn("[data-storage] dataStoragePendingClear failed", error);
    throw error;
  }
}

export { dataStoragePendingClear };
