import { workerStoragePendingSet } from "../pending/set.js";

/** Stores a successful scan URI and reopens the extension popup. */
async function workerStorageStoreSuccess(uri) {
  await workerStoragePendingSet({
    status: "ready",
    uri,
  });
  await chrome.action.openPopup();
}

export { workerStorageStoreSuccess };
