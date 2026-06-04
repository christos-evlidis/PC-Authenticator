import { QR_SCAN_MESSAGES } from "./scan-constants.js";
import { QR_SCAN_UNSUPPORTED_PAGE_ERROR } from "./scan-constants.js";
import { qrScanMessageSend } from "./scan-tabs/scan-messaging.js";
import { qrScanMessageSendOrError } from "./scan-tabs/scan-messaging.js";

export { QR_SCAN_MESSAGES };
export { QR_SCAN_UNSUPPORTED_PAGE_ERROR };

/** Starts the QR scan overlay on the active tab. */
export async function qrScanStart() {
  return qrScanMessageSendOrError({ action: QR_SCAN_MESSAGES.START });
}

/** Cancels an in-progress scan and clears pending state. */
export async function qrScanCancel() {
  return qrScanMessageSendOrError({ action: QR_SCAN_MESSAGES.CANCEL });
}

/** Reads the pending QR scan result from session storage. */
export async function qrScanPendingGet() {
  return qrScanMessageSend({ action: QR_SCAN_MESSAGES.GET_PENDING });
}

/** Clears the pending QR scan session entry. */
export async function qrScanPendingClear() {
  return qrScanMessageSendOrError({ action: QR_SCAN_MESSAGES.CLEAR_PENDING });
}
