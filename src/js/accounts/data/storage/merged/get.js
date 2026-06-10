import { dataMerged } from "../../../accounts-const.js";

async function dataStorageMergedGet() {
  try {
    const stored = await chrome.storage.local.get([dataMerged]);
    return stored[dataMerged];
  } catch (error) {
    console.warn("[data-storage] dataStorageMergedGet failed", error);
    throw error;
  }
}

export { dataStorageMergedGet };
