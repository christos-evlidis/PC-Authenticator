import { PENDING_KEY } from "../../scan-constants.js";
import { scanPopupReopen } from "../../messaging/index.js";

/** Reads the pending QR scan result from session storage. */
async function scanPendingGet() {
  const stored = await chrome.storage.session.get([PENDING_KEY]);

  return stored[PENDING_KEY];
}

/** Writes a pending QR scan payload to session storage. */
async function scanPendingSet(payload) {
  await chrome.storage.session.set({ [PENDING_KEY]: payload });
}

/** Clears the pending QR scan session entry. */
async function scanPendingClear() {
  await chrome.storage.session.remove([PENDING_KEY]);
}

/** Stores a scan error and reopens the extension popup. */
async function scanFailureStore(message) {
  await scanPendingSet({
    status: "error",
    message,
  });
  await scanPopupReopen();
}

/** Stores a successful scan URI and reopens the extension popup. */
async function scanSuccessStore(uri) {
  await scanPendingSet({
    status: "ready",
    uri,
  });
  await scanPopupReopen();
}

export { scanPendingGet };
export { scanPendingClear };
export { scanFailureStore };
export { scanSuccessStore };
