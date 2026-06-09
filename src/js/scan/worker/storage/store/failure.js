import { workerStoragePendingSet } from "../pending/set.js";

/** Stores a scan error and reopens the extension popup. */
async function workerStorageStoreFailure(message) {
  await workerStoragePendingSet({
    status: "error",
    message,
  });
  await chrome.action.openPopup();
}

export { workerStorageStoreFailure };
