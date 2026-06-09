import { OVERLAY_HOST_CLASS } from "../../constants.js";
import { MESSAGES } from "../../constants.js";

export const contentOverlayActiveSession = {
  teardown: null,
};

/** Tears down selection listeners and removes the overlay from the page. */
function contentOverlayRemove({ notifyCancel = false } = {}) {
  contentOverlayActiveSession.teardown?.();
  contentOverlayActiveSession.teardown = null;
  document.querySelector(`.${OVERLAY_HOST_CLASS}`)?.remove();

  if (notifyCancel) {
    chrome.runtime.sendMessage({ action: MESSAGES.CANCELLED_EVENT });
  }
}

export { contentOverlayRemove };
