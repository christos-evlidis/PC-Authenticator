import { qrScanRegionDecode } from "../scan-decoder/scan-decode.js";
import { QR_SCAN_MESSAGES } from "../scan-constants.js";
import { SCAN_START_FAILED_ERROR } from "../scan-constants.js";
import { qrScanPendingClear } from "../scan-state/scan-pending.js";
import { qrScanFailureStore } from "../scan-state/scan-pending.js";
import { qrScanSuccessStore } from "../scan-state/scan-pending.js";
import { qrScanTabCapture } from "../scan-tabs/scan-capture.js";
import { qrScanOverlayInject } from "../scan-tabs/scan-inject.js";
import { qrScanContentReadyWait } from "../scan-tabs/scan-inject.js";
import { qrScanTabUrlGet } from "../scan-tabs/scan-resolve.js";
import { qrScanTabScannableIs } from "../scan-tabs/scan-resolve.js";
import { qrScanTargetTabResolve } from "../scan-tabs/scan-resolve.js";
import { qrScanTabMessage } from "../scan-tabs/scan-messaging.js";
import { qrScanPopupCancelNotify } from "../scan-tabs/scan-messaging.js";
import { qrScanErrorResponseCreate } from "../scan-tabs/scan-messaging.js";

/** Appends underlying error details to the scan start failure message. */
function qrScanStartErrorFormat(error) {
  const message =
    error instanceof Error ? error.message : String(error ?? "");

  return message ? `${SCAN_START_FAILED_ERROR} (${message})` : SCAN_START_FAILED_ERROR;
}

/** Reports which tab would be used for scanning (debug/QA). */
export async function qrScanTargetGet() {
  const { tab, error, detectedUrl } = await qrScanTargetTabResolve();

  return {
    success: Boolean(tab),
    error,
    detectedUrl,
    tab: tab
      ? {
          id: tab.id,
          url: qrScanTabUrlGet(tab),
          pendingUrl: tab.pendingUrl ?? null,
          active: tab.active ?? null,
          windowId: tab.windowId ?? null,
        }
      : null,
  };
}

/** Starts the overlay selection flow on the active tab. */
export async function qrScanStartHandle() {
  const { tab, error } = await qrScanTargetTabResolve();

  if (!tab) {
    return qrScanErrorResponseCreate(error);
  }

  const injected = await qrScanOverlayInject(tab.id);

  if (!injected.ok) {
    console.warn("[qr-scan] injectSelectionOverlay failed", injected.error);

    return qrScanErrorResponseCreate(qrScanStartErrorFormat(injected.error));
  }

  const ready = await qrScanContentReadyWait(tab.id);

  if (!ready) {
    return qrScanErrorResponseCreate(
      qrScanStartErrorFormat("QR scanner did not load in time."),
    );
  }

  const messaged = await qrScanTabMessage(tab.id, QR_SCAN_MESSAGES.START_OVERLAY);

  if (!messaged.ok) {
    console.warn("[qr-scan] messageTab failed", messaged.error);

    return qrScanErrorResponseCreate(qrScanStartErrorFormat(messaged.error));
  }

  return { success: true };
}

/** Captures the visible tab for content-script cropping. */
export async function qrScanTabCaptureHandle() {
  const { tab, error } = await qrScanTargetTabResolve();

  if (!tab) {
    return qrScanErrorResponseCreate(error);
  }

  try {
    const imageData = await qrScanTabCapture(tab.windowId);

    if (!imageData) {
      return qrScanErrorResponseCreate(SCAN_START_FAILED_ERROR);
    }

    return { success: true, imageData };
  } catch (error) {
    return qrScanErrorResponseCreate(qrScanStartErrorFormat(error));
  }
}

/** Decodes a cropped selection and stores the scan result. */
export async function qrScanSelectionHandle(message) {
  if (message.error) {
    await qrScanFailureStore(message.error);
    return { success: true };
  }

  const result = qrScanRegionDecode(
    message.imageData,
    message.width,
    message.height,
  );

  if (result) {
    await qrScanSuccessStore(result.data);
  } else {
    await qrScanFailureStore("No QR code found in the selected area.");
  }

  return { success: true };
}

/** Aborts an in-progress scan and optionally removes the tab overlay. */
export async function qrScanSelectionAbortHandle(options = {}) {
  const { removeTabOverlay = false } = options;

  if (removeTabOverlay) {
    const { tab } = await qrScanTargetTabResolve();

    if (tab && (await qrScanTabScannableIs(tab))) {
      await qrScanTabMessage(tab.id, QR_SCAN_MESSAGES.CANCEL_OVERLAY);
    }
  }

  await qrScanPendingClear();
  qrScanPopupCancelNotify();

  return { success: true };
}
