import { dataMerged } from "../../../accounts-const.js";

/** Persists merged accounts to local storage. */
async function dataStorageMergedSet(accounts) {
  try {
    await chrome.storage.local.set({ [dataMerged]: accounts });
  } catch (error) {
    console.warn("[data-storage] dataStorageMergedSet failed", error);
    throw error;
  }
}

export { dataStorageMergedSet };
