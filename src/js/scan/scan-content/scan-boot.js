import { qrScanSelectionCapture } from "../scan-capture/scan-screenshot.js";
import { QR_SCAN_MESSAGES } from "../scan-constants.js";
import { qrScanOverlayElementsCreate } from "../scan-overlay/scan-elements.js";
import { qrScanOverlayHostCreate } from "../scan-overlay/scan-host.js";
import { qrScanOverlayHostRemove } from "../scan-overlay/scan-host.js";
import { qrScanSelectionHandlersAttach } from "../scan-overlay/scan-selection.js";
import { qrScanContentListenersRegister } from "./scan-listeners.js";

const activeSession = {
  teardown: null,
};

/** Removes the overlay and detaches selection listeners. */
export function qrScanOverlayRemove({ notifyCancel = false } = {}) {
  activeSession.teardown?.();
  activeSession.teardown = null;
  qrScanOverlayHostRemove();

  if (notifyCancel) {
    chrome.runtime.sendMessage({ action: QR_SCAN_MESSAGES.CANCELLED_EVENT });
  }
}

/** Opens the selection overlay and begins listening for user input. */
export function qrScanOverlayStart() {
  qrScanOverlayRemove();

  const { shadow } = qrScanOverlayHostCreate();
  const { overlay, selectionBox } = qrScanOverlayElementsCreate(shadow);

  activeSession.teardown = qrScanSelectionHandlersAttach(overlay, selectionBox, {
    onCancel: () => qrScanOverlayRemove({ notifyCancel: true }),
    onComplete: async (selection) => {
      try {
        const cropped = await qrScanSelectionCapture(selection);

        await chrome.runtime.sendMessage({
          action: QR_SCAN_MESSAGES.SCAN_QR_CODE,
          imageData: cropped.imageData,
          width: cropped.width,
          height: cropped.height,
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "QR scanning cannot run on this page. Open a normal website tab and try again.";

        await chrome.runtime.sendMessage({
          action: QR_SCAN_MESSAGES.SCAN_QR_CODE,
          error: message,
        });
      }

      qrScanOverlayRemove();
    },
  });
}

/** Initializes content-script message listeners and overlay lifecycle. */
export function qrScanContentInit() {
  qrScanContentListenersRegister({
    start: qrScanOverlayStart,
    cancel: () => qrScanOverlayRemove(),
  });
}
