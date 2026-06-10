import { dataRestored } from "../../../accounts-const.js";

/** Removes restored accounts from local storage. */
async function dataStorageRestoredClear() {
  try {
    await chrome.storage.local.remove([dataRestored]);
  } catch (error) {
    console.warn("[data-storage] dataStorageRestoredClear failed", error);
    throw error;
  }
}

export { dataStorageRestoredClear };
