import { DATA_MERGED } from "../../data-const.js";

/** Removes the merged accounts key from storage. */
export async function dataStorageMergedClear() {
  try {
    await chrome.storage.local.remove(DATA_MERGED);
  } catch (error) {
    console.warn("[data-storage] dataStorageMergedClear failed", error);
    throw error;
  }
}
