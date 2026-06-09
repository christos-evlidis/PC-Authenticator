import { QR_SCAN_MESSAGES } from "../scan-constants.js";
import { QR_SCAN_UNSUPPORTED_PAGE_ERROR } from "../scan-constants.js";

/** Returns a failed scan response object with an error message. */
function scanErrorResponseCreate(
  error = QR_SCAN_UNSUPPORTED_PAGE_ERROR,
) {
  return { success: false, error };
}

/** Notifies the extension popup that the user cancelled selection. */
function scanPopupCancelNotify() {
  chrome.runtime.sendMessage({ action: QR_SCAN_MESSAGES.CANCELLED_EVENT });
}

/** Reopens the extension action popup. */
async function scanPopupReopen() {
  await chrome.action.openPopup();
}

export { scanErrorResponseCreate };
export { scanPopupCancelNotify };
export { scanPopupReopen };
