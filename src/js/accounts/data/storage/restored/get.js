import { dataRestored } from "../../../constants.js";

async function dataStorageRestoredGet() {
  try {
    const stored = await chrome.storage.local.get([dataRestored]);
    return stored[dataRestored];
  } catch (error) {
    console.warn("[data-storage] dataStorageRestoredGet failed", error);
    throw error;
  }
}

export { dataStorageRestoredGet };
