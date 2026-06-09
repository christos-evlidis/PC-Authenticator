import { DATA_KEY_MERGED } from "../../../constants.js";

/** Writes the merged (unencrypted) account list. */
async function dataStorageMergedSet(accounts) {
  try {
    await chrome.storage.local.set({ [DATA_KEY_MERGED]: accounts });
  } catch (error) {
    console.warn("[data-storage] dataStorageMergedSet failed", error);
    throw error;
  }
}

export { dataStorageMergedSet };
