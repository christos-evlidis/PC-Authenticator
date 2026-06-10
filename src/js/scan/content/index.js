import { contentOverlayRemove } from "./overlay/remove.js";
import { contentOverlayStart } from "./overlay/start.js";

import { MESSAGES } from "../constants.js";

function contentScriptInit() {
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.action === MESSAGES.PING) {
      sendResponse({ loaded: true });
      return false;
    }

    if (message.action === MESSAGES.CANCEL_OVERLAY) {
      contentOverlayRemove();
      sendResponse({ success: true });
      return false;
    }

    if (message.action === MESSAGES.START_OVERLAY) {
      contentOverlayStart();
      sendResponse({ success: true });
      return false;
    }

    return false;
  });
}

export { contentScriptInit };
