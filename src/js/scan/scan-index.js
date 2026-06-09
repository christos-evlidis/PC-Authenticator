import { QR_SCAN_MESSAGES } from "./scan-constants.js";
import { QR_SCAN_UNSUPPORTED_PAGE_ERROR } from "./scan-constants.js";
import { scanMessageSend } from "./messaging/index.js";
import { scanMessageSendOrError } from "./messaging/index.js";

/** Starts the QR scan overlay on the active tab. */
async function scanStart() {
  return scanMessageSendOrError({ action: QR_SCAN_MESSAGES.START });
}

/** Cancels an in-progress scan and clears pending state. */
async function scanCancel() {
  return scanMessageSendOrError({ action: QR_SCAN_MESSAGES.CANCEL });
}

/** Reads the pending QR scan result from session storage. */
async function scanPendingGet() {
  return scanMessageSend({ action: QR_SCAN_MESSAGES.GET_PENDING });
}

/** Clears the pending QR scan session entry. */
async function scanPendingClear() {
  return scanMessageSendOrError({ action: QR_SCAN_MESSAGES.CLEAR_PENDING });
}

export { scanStart };
export { scanCancel };
export { scanPendingGet };
export { scanPendingClear };
export { QR_SCAN_UNSUPPORTED_PAGE_ERROR };
export { QR_SCAN_MESSAGES };
