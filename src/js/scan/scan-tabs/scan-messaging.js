import { QR_SCAN_MESSAGES } from "../scan-constants.js";
import { QR_SCAN_UNSUPPORTED_PAGE_ERROR } from "../scan-constants.js";

/** Sends a runtime message to the service worker and returns the raw response. */
export function qrScanMessageSend(payload) {
  return new Promise((resolve) => {
    if (!chrome?.runtime?.sendMessage) {
      resolve(undefined);
      return;
    }

    chrome.runtime.sendMessage(payload, (response) => {
      if (chrome.runtime.lastError) {
        resolve(undefined);
        return;
      }

      resolve(response);
    });
  });
}

/** Sends a scan action message; failed delivery becomes a scan error response. */
export function qrScanMessageSendOrError(payload) {
  return new Promise((resolve) => {
    if (!chrome?.runtime?.sendMessage) {
      resolve({ success: false, error: QR_SCAN_UNSUPPORTED_PAGE_ERROR });
      return;
    }

    chrome.runtime.sendMessage(payload, (response) => {
      if (chrome.runtime.lastError) {
        resolve({ success: false, error: QR_SCAN_UNSUPPORTED_PAGE_ERROR });
        return;
      }

      resolve(response);
    });
  });
}

/** Returns a failed scan response object with an error message. */
export function qrScanErrorResponseCreate(
  error = QR_SCAN_UNSUPPORTED_PAGE_ERROR,
) {
  return { success: false, error };
}

/** Returns whether a messaging error means the content script is missing. */
function qrScanReceivingEndMissing(error) {
  const message =
    error instanceof Error ? error.message : String(error ?? "");

  return message.includes("Receiving end does not exist");
}

/** Sends an action message to a tab's content script. */
export async function qrScanTabMessage(tabId, action) {
  try {
    const response = await chrome.tabs.sendMessage(tabId, { action });

    return { ok: true, response };
  } catch (error) {
    return {
      ok: false,
      error,
      receivingEndMissing: qrScanReceivingEndMissing(error),
    };
  }
}

/** Notifies the extension popup that the user cancelled selection. */
export function qrScanPopupCancelNotify() {
  chrome.runtime.sendMessage({ action: QR_SCAN_MESSAGES.CANCELLED_EVENT });
}

/** Reopens the extension action popup. */
export async function qrScanPopupReopen() {
  await chrome.action.openPopup();
}
