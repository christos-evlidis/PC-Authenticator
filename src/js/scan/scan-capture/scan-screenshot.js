import { QR_SCAN_MESSAGES } from "../scan-constants.js";
import { QR_SCAN_UNSUPPORTED_PAGE_ERROR } from "../scan-constants.js";
import { qrScanScreenshotCrop } from "./scan-crop.js";

/** Loads a screenshot data URL into an Image element. */
export function qrScanScreenshotLoad(dataUrl) {
  const img = new Image();

  return new Promise((resolve) => {
    img.onload = () => resolve(img);
    img.src = dataUrl;
  });
}

/** Requests a tab screenshot from the service worker and crops the selection. */
export async function qrScanSelectionCapture(selection) {
  const response = await chrome.runtime.sendMessage({
    action: QR_SCAN_MESSAGES.CAPTURE_TAB,
  });

  if (!response?.success || !response?.imageData) {
    throw new Error(response?.error || QR_SCAN_UNSUPPORTED_PAGE_ERROR);
  }

  const img = await qrScanScreenshotLoad(response.imageData);

  return qrScanScreenshotCrop(img, selection);
}
