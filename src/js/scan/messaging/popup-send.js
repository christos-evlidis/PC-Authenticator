import { QR_SCAN_UNSUPPORTED_PAGE_ERROR } from "../scan-constants.js";

/** Sends a runtime message to the service worker and returns the raw response. */
function scanMessageSend(payload) {
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
function scanMessageSendOrError(payload) {
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

export { scanMessageSend };
export { scanMessageSendOrError };
