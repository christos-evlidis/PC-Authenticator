import { dataMerged } from "../../../accounts-const.js";

/** Removes merged accounts from local storage. */
async function dataStorageMergedClear() {
  try {
    await chrome.storage.local.remove([dataMerged]);
  } catch (error) {
    console.warn("[data-storage] dataStorageMergedClear failed", error);
    throw error;
  }
}

export { dataStorageMergedClear };
