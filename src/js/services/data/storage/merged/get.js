import { DATA_MERGED } from "../../data-const.js";

/** Retrieves merged accounts from storage. */
export async function dataStorageMergedGet() {
  try {
    const result = await chrome.storage.local.get(DATA_MERGED);
    return result[DATA_MERGED] || [];
  } catch (error) {
    console.warn("[data-storage] dataStorageMergedGet failed", error);
    throw error;
  }
}
