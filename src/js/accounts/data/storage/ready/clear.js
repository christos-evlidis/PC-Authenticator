import { DATA_KEY_FINAL } from "../../../accounts-const.js";

async function dataStorageReadyClear() {
  try {
    await chrome.storage.local.remove([DATA_KEY_FINAL]);
  } catch (error) {
    console.warn("[data-storage] dataStorageReadyClear failed", error);
    throw error;
  }
}

export { dataStorageReadyClear };
