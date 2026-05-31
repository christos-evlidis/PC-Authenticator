import { QR_SCAN_MESSAGES } from "../scan-constants.js";
import { QR_SCAN_UNSUPPORTED_PAGE_ERROR } from "../scan-constants.js";
import { qrScanPendingClear } from "../scan-state/scan-pending.js";
import { qrScanPendingGet } from "../scan-state/scan-pending.js";
import { qrScanSelectionAbortHandle } from "./scan-handlers.js";
import { qrScanTabCaptureHandle } from "./scan-handlers.js";
import { qrScanTargetGet } from "./scan-handlers.js";
import { qrScanSelectionHandle } from "./scan-handlers.js";
import { qrScanStartHandle } from "./scan-handlers.js";
import { qrScanErrorResponseCreate } from "../scan-tabs/scan-messaging.js";

/** Registers background/service-worker runtime message routing. */
export function qrScanBackgroundListenersRegister() {
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    const { action } = message;

    if (action === QR_SCAN_MESSAGES.CANCELLED_EVENT) {
      qrScanSelectionAbortHandle({ removeTabOverlay: false });
      return false;
    }

    const asyncActions = {
      [QR_SCAN_MESSAGES.START]: () => qrScanStartHandle(),
      [QR_SCAN_MESSAGES.GET_SCAN_TARGET]: () => qrScanTargetGet(),
      [QR_SCAN_MESSAGES.CAPTURE_TAB]: () => qrScanTabCaptureHandle(),
      [QR_SCAN_MESSAGES.SCAN_QR_CODE]: () => qrScanSelectionHandle(message),
      [QR_SCAN_MESSAGES.GET_PENDING]: () => qrScanPendingGet(),
      [QR_SCAN_MESSAGES.CLEAR_PENDING]: async () => {
        await qrScanPendingClear();
        return { success: true };
      },
      [QR_SCAN_MESSAGES.CANCEL]: () =>
        qrScanSelectionAbortHandle({ removeTabOverlay: true }),
    };

    const run = asyncActions[action];

    if (!run) {
      return false;
    }

    run()
      .then((result) => {
        sendResponse(
          result ?? qrScanErrorResponseCreate(QR_SCAN_UNSUPPORTED_PAGE_ERROR),
        );
      })
      .catch(() => {
        sendResponse(qrScanErrorResponseCreate(QR_SCAN_UNSUPPORTED_PAGE_ERROR));
      });

    return true;
  });
}
