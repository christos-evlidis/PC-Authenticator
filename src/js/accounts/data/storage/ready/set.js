import { DATA_KEY_FINAL } from "../../../constants.js";

/** Writes the final (active) account list to local storage. */
async function dataStorageReadySet(accounts) {
  try {
    await chrome.storage.local.set({ [DATA_KEY_FINAL]: accounts });
  } catch (error) {
    console.warn("[data-storage] dataStorageReadySet failed", error);
    throw error;
  }
}

export { dataStorageReadySet };
