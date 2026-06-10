import { DATA_KEY_PENDING } from "../../../constants.js";

async function dataStoragePendingSet(accounts) {
  try {
    await chrome.storage.local.set({ [DATA_KEY_PENDING]: accounts });
  } catch (error) {
    console.warn("[data-storage] dataStoragePendingSet failed", error);
    throw error;
  }
}

export { dataStoragePendingSet };
