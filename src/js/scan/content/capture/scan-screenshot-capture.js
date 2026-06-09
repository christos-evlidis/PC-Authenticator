import { QR_SCAN_MESSAGES } from "../../scan-constants.js";
import { QR_SCAN_UNSUPPORTED_PAGE_ERROR } from "../../scan-constants.js";
import { scanScreenshotCrop } from "./scan-screenshot-crop.js";
import { scanScreenshotLoad } from "./scan-screenshot-load.js";

/** Requests a tab screenshot from the service worker and crops the selection. */
async function scanScreenshotCapture(selection) {
  const response = await chrome.runtime.sendMessage({
    action: QR_SCAN_MESSAGES.CAPTURE_TAB,
  });

  if (!response?.success || !response?.imageData) {
    throw new Error(response?.error || QR_SCAN_UNSUPPORTED_PAGE_ERROR);
  }

  const img = await scanScreenshotLoad(response.imageData);

  return scanScreenshotCrop(img, selection);
}

export { scanScreenshotCapture };
