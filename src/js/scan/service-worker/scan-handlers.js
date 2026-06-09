import { scanRegionDecode } from "./decoder/scan-decode.js";
import { QR_SCAN_MESSAGES } from "../scan-constants.js";
import { SCAN_START_FAILED_ERROR } from "../scan-constants.js";
import { scanPendingClear } from "./storage/scan-pending.js";
import { scanFailureStore } from "./storage/scan-pending.js";
import { scanSuccessStore } from "./storage/scan-pending.js";
import { scanTabCapture } from "./tab/scan-capture.js";
import { scanOverlayInject } from "./tab/scan-inject.js";
import { scanContentReadyWait } from "./tab/scan-inject.js";
import { scanTabUrlGet } from "./tab/scan-resolve.js";
import { scanTabScannableIs } from "./tab/scan-resolve.js";
import { scanTargetTabResolve } from "./tab/scan-resolve.js";
import { scanTabMessage } from "../messaging/index.js";
import { scanPopupCancelNotify } from "../messaging/index.js";
import { scanErrorResponseCreate } from "../messaging/index.js";

/** Appends underlying error details to the scan start failure message. */
function scanStartErrorFormat(error) {
  const message =
    error instanceof Error ? error.message : String(error ?? "");

  return message ? `${SCAN_START_FAILED_ERROR} (${message})` : SCAN_START_FAILED_ERROR;
}

/** Reports which tab would be used for scanning (debug/QA). */
async function scanTargetGet() {
  const { tab, error, detectedUrl } = await scanTargetTabResolve();

  return {
    success: Boolean(tab),
    error,
    detectedUrl,
    tab: tab
      ? {
          id: tab.id,
          url: scanTabUrlGet(tab),
          pendingUrl: tab.pendingUrl ?? null,
          active: tab.active ?? null,
          windowId: tab.windowId ?? null,
        }
      : null,
  };
}

/** Starts the overlay selection flow on the active tab. */
async function scanStartHandle() {
  const { tab, error } = await scanTargetTabResolve();

  if (!tab) {
    return scanErrorResponseCreate(error);
  }

  const injected = await scanOverlayInject(tab.id);

  if (!injected.ok) {
    console.warn("[scan] injectSelectionOverlay failed", injected.error);

    return scanErrorResponseCreate(scanStartErrorFormat(injected.error));
  }

  const ready = await scanContentReadyWait(tab.id);

  if (!ready) {
    return scanErrorResponseCreate(
      scanStartErrorFormat("QR scanner did not load in time."),
    );
  }

  const messaged = await scanTabMessage(tab.id, QR_SCAN_MESSAGES.START_OVERLAY);

  if (!messaged.ok) {
    console.warn("[scan] messageTab failed", messaged.error);

    return scanErrorResponseCreate(scanStartErrorFormat(messaged.error));
  }

  return { success: true };
}

/** Captures the visible tab for content-script cropping. */
async function scanTabCaptureHandle() {
  const { tab, error } = await scanTargetTabResolve();

  if (!tab) {
    return scanErrorResponseCreate(error);
  }

  try {
    const imageData = await scanTabCapture(tab.windowId);

    if (!imageData) {
      return scanErrorResponseCreate(SCAN_START_FAILED_ERROR);
    }

    return { success: true, imageData };
  } catch (error) {
    return scanErrorResponseCreate(scanStartErrorFormat(error));
  }
}

/** Decodes a cropped selection and stores the scan result. */
async function scanSelectionHandle(message) {
  if (message.error) {
    await scanFailureStore(message.error);
    return { success: true };
  }

  const result = scanRegionDecode(
    message.imageData,
    message.width,
    message.height,
  );

  if (result) {
    await scanSuccessStore(result.data);
  } else {
    await scanFailureStore("No QR code found in the selected area.");
  }

  return { success: true };
}

/** Aborts an in-progress scan and optionally removes the tab overlay. */
async function scanSelectionAbortHandle(options = {}) {
  const { removeTabOverlay = false } = options;

  if (removeTabOverlay) {
    const { tab } = await scanTargetTabResolve();

    if (tab && (await scanTabScannableIs(tab))) {
      await scanTabMessage(tab.id, QR_SCAN_MESSAGES.CANCEL_OVERLAY);
    }
  }

  await scanPendingClear();
  scanPopupCancelNotify();

  return { success: true };
}

export { scanTargetGet };
export { scanStartHandle };
export { scanTabCaptureHandle };
export { scanSelectionHandle };
export { scanSelectionAbortHandle };
