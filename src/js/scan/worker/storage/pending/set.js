import { PENDING_KEY } from "../../../constants.js";

/** Writes a pending QR scan payload to session storage. */
async function workerStoragePendingSet(payload) {
  try {
    await chrome.storage.session.set({ [PENDING_KEY]: payload });
  } catch (error) {
    console.warn("[scan-storage] workerStoragePendingSet failed", error);
    throw error;
  }
}

export { workerStoragePendingSet };
