import { PENDING_KEY } from "../../../scan-const.js";

/** Removes the pending QR scan entry from session storage. */
async function workerStoragePendingClear() {
  try {
    await chrome.storage.session.remove([PENDING_KEY]);
  } catch (error) {
    console.warn("[scan-storage] workerStoragePendingClear failed", error);
    throw error;
  }
}

export { workerStoragePendingClear };
