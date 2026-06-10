import { OVERLAY_HOST_CLASS } from "../../constants.js";
import { MESSAGES } from "../../constants.js";
import { contentOverlayStateStore } from "./state/store.js";

/** Tears down selection listeners and removes the overlay from the page. */
function contentOverlayRemove({ notifyCancel = false } = {}) {
  contentOverlayStateStore.teardown?.();
  contentOverlayStateStore.teardown = null;
  document.querySelector(`.${OVERLAY_HOST_CLASS}`)?.remove();

  if (notifyCancel) {
    chrome.runtime.sendMessage({ action: MESSAGES.CANCELLED_EVENT });
  }
}

export { contentOverlayRemove };
export { contentOverlayStateStore } from "./state/store.js";
