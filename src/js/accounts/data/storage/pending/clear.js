import { DATA_KEY_PENDING } from "../../../accounts-const.js";

async function dataStoragePendingClear() {
  try {
    await chrome.storage.local.remove([DATA_KEY_PENDING]);
  } catch (error) {
    console.warn("[data-storage] dataStoragePendingClear failed", error);
    throw error;
  }
}

export { dataStoragePendingClear };
