import { PENDING_KEY } from "../../../constants.js";

/** Reads the pending QR scan result from session storage. */
async function workerStoragePendingGet() {
  try {
    const stored = await chrome.storage.session.get([PENDING_KEY]);

    return stored[PENDING_KEY];
  } catch (error) {
    console.warn("[scan-storage] workerStoragePendingGet failed", error);
    throw error;
  }
}

export { workerStoragePendingGet };
