import { contentOverlayStateStore } from "./state/store.js";

import { MESSAGES } from "../../scan-const.js";
import { OVERLAY_HOST_CLASS } from "../../scan-const.js";

function contentOverlayRemove({ notifyCancel = false } = {}) {
  contentOverlayStateStore.teardown?.();
  contentOverlayStateStore.teardown = null;
  document.querySelector(`.${OVERLAY_HOST_CLASS}`)?.remove();

  if (notifyCancel) {
    chrome.runtime.sendMessage({ action: MESSAGES.CANCELLED_EVENT });
  }
}

export { contentOverlayRemove };
