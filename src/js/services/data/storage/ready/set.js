import { DATA_KEY_FINAL } from "../../data-const.js";

/** Persists ready accounts to local storage. */
async function dataStorageReadySet(accounts) {
  try {
    await chrome.storage.local.set({ [DATA_KEY_FINAL]: accounts });
  } catch (error) {
    console.warn("[data-storage] dataStorageReadySet failed", error);
    throw error;
  }
}

export { dataStorageReadySet };
