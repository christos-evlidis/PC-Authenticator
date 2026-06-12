import { DATA_MERGED } from "../../data-const.js";

/** Saves the merged accounts list to storage. */
export async function dataStorageMergedSet(accounts) {
  try {
    await chrome.storage.local.set({ [DATA_MERGED]: accounts });
  } catch (error) {
    console.warn("[data-storage] dataStorageMergedSet failed", error);
    throw error;
  }
}
