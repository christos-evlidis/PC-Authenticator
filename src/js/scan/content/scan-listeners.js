import { QR_SCAN_MESSAGES } from "../scan-constants.js";

/** Registers content-script runtime message routing. */
function scanContentListenersRegister(callbacks) {
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.action === QR_SCAN_MESSAGES.PING) {
      sendResponse({ loaded: true });
      return false;
    }

    if (message.action === QR_SCAN_MESSAGES.CANCEL_OVERLAY) {
      callbacks.cancel();
      sendResponse({ success: true });
      return false;
    }

    if (message.action === QR_SCAN_MESSAGES.START_OVERLAY) {
      callbacks.start();
      sendResponse({ success: true });
      return false;
    }

    return false;
  });
}

export { scanContentListenersRegister };
