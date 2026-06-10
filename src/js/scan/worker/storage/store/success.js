import { workerStoragePendingSet } from "../pending/set.js";

/** Stores a successful scan URI and reopens the extension popup. */
async function workerStorageStoreSuccess(uri) {
  try {
    await workerStoragePendingSet({
      status: "ready",
      uri,
    });
    await chrome.action.openPopup();
  } catch (error) {
    console.warn("[scan-storage] workerStorageStoreSuccess failed", error);
    throw error;
  }
}

export { workerStorageStoreSuccess };
