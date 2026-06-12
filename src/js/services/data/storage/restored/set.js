import { DATA_RESTORED } from "../../data-const.js";

/** Saves the restored accounts list to storage. */
export async function dataStorageRestoredSet(accounts) {
  try {
    await chrome.storage.local.set({ [DATA_RESTORED]: accounts });
  } catch (error) {
    console.warn("[data-storage] dataStorageRestoredSet failed", error);
    throw error;
  }
}
