import { dataMerged } from "../../../accounts-const.js";

async function dataStorageMergedSet(accounts) {
  try {
    await chrome.storage.local.set({ [dataMerged]: accounts });
  } catch (error) {
    console.warn("[data-storage] dataStorageMergedSet failed", error);
    throw error;
  }
}

export { dataStorageMergedSet };
