import { workerStoragePendingSet } from "../pending/set.js";

async function workerStorageStoreFailure(message) {
  try {
    await workerStoragePendingSet({
      status: "error",
      message,
    });
    await chrome.action.openPopup();
  } catch (error) {
    console.warn("[scan-storage] workerStorageStoreFailure failed", error);
    throw error;
  }
}

export { workerStorageStoreFailure };
