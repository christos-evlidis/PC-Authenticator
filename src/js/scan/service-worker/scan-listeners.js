import { QR_SCAN_MESSAGES } from "../scan-constants.js";
import { QR_SCAN_UNSUPPORTED_PAGE_ERROR } from "../scan-constants.js";
import { scanPendingClear } from "./storage/scan-pending.js";
import { scanPendingGet } from "./storage/scan-pending.js";
import { scanSelectionAbortHandle } from "./scan-handlers.js";
import { scanTabCaptureHandle } from "./scan-handlers.js";
import { scanTargetGet } from "./scan-handlers.js";
import { scanSelectionHandle } from "./scan-handlers.js";
import { scanStartHandle } from "./scan-handlers.js";
import { scanErrorResponseCreate } from "../messaging/index.js";

/** Registers background/service-worker runtime message routing. */
function scanBackgroundListenersRegister() {
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    const { action } = message;

    if (action === QR_SCAN_MESSAGES.CANCELLED_EVENT) {
      scanSelectionAbortHandle({ removeTabOverlay: false });
      return false;
    }

    const asyncActions = {
      [QR_SCAN_MESSAGES.START]: () => scanStartHandle(),
      [QR_SCAN_MESSAGES.GET_SCAN_TARGET]: () => scanTargetGet(),
      [QR_SCAN_MESSAGES.CAPTURE_TAB]: () => scanTabCaptureHandle(),
      [QR_SCAN_MESSAGES.SCAN_QR_CODE]: () => scanSelectionHandle(message),
      [QR_SCAN_MESSAGES.GET_PENDING]: () => scanPendingGet(),
      [QR_SCAN_MESSAGES.CLEAR_PENDING]: async () => {
        await scanPendingClear();
        return { success: true };
      },
      [QR_SCAN_MESSAGES.CANCEL]: () =>
        scanSelectionAbortHandle({ removeTabOverlay: true }),
    };

    const run = asyncActions[action];

    if (!run) {
      return false;
    }

    run()
      .then((result) => {
        sendResponse(
          result ?? scanErrorResponseCreate(QR_SCAN_UNSUPPORTED_PAGE_ERROR),
        );
      })
      .catch(() => {
        sendResponse(scanErrorResponseCreate(QR_SCAN_UNSUPPORTED_PAGE_ERROR));
      });

    return true;
  });
}

export { scanBackgroundListenersRegister };
