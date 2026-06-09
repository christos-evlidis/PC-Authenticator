import { PENDING_KEY } from "../../../constants.js";

/** Writes a pending QR scan payload to session storage. */
async function workerStoragePendingSet(payload) {
  await chrome.storage.session.set({ [PENDING_KEY]: payload });
}

export { workerStoragePendingSet };
