import { PENDING_KEY } from "../../../constants.js";

/** Reads the pending QR scan result from session storage. */
async function workerStoragePendingGet() {
  const stored = await chrome.storage.session.get([PENDING_KEY]);

  return stored[PENDING_KEY];
}

export { workerStoragePendingGet };
