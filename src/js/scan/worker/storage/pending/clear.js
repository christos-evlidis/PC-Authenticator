import { PENDING_KEY } from "../../constants.js";

/** Clears the pending QR scan session entry. */
async function workerStoragePendingClear() {
  await chrome.storage.session.remove([PENDING_KEY]);
}

export { workerStoragePendingClear };
