import { dataRestored } from "../../../accounts-const.js";

/** Persists restored accounts to local storage. */
async function dataStorageRestoredSet(accounts) {
  try {
    await chrome.storage.local.set({ [dataRestored]: accounts });
  } catch (error) {
    console.warn("[data-storage] dataStorageRestoredSet failed", error);
    throw error;
  }
}

export { dataStorageRestoredSet };
