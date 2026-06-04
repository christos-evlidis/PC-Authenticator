import { PENDING_KEY } from "../scan-constants.js";
import { qrScanPopupReopen } from "../scan-tabs/scan-messaging.js";

/** Reads the pending QR scan result from session storage. */
export async function qrScanPendingGet() {
  const stored = await chrome.storage.session.get([PENDING_KEY]);

  return stored[PENDING_KEY];
}

/** Writes a pending QR scan payload to session storage. */
export async function qrScanPendingSet(payload) {
  await chrome.storage.session.set({ [PENDING_KEY]: payload });
}

/** Clears the pending QR scan session entry. */
export async function qrScanPendingClear() {
  await chrome.storage.session.remove([PENDING_KEY]);
}

/** Stores a scan error and reopens the extension popup. */
export async function qrScanFailureStore(message) {
  await qrScanPendingSet({
    status: "error",
    message,
  });
  await qrScanPopupReopen();
}

/** Stores a successful scan URI and reopens the extension popup. */
export async function qrScanSuccessStore(uri) {
  await qrScanPendingSet({
    status: "ready",
    uri,
  });
  await qrScanPopupReopen();
}
