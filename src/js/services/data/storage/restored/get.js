import { DATA_RESTORED } from "../../data-const.js";

/** Retrieves restored accounts from storage. */
export async function dataStorageRestoredGet() {
  try {
    const result = await chrome.storage.local.get(DATA_RESTORED);
    return result[DATA_RESTORED] || [];
  } catch (error) {
    console.warn("[data-storage] dataStorageRestoredGet failed", error);
    throw error;
  }
}
