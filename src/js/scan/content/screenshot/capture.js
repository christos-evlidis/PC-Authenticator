import { MESSAGES } from "../../constants.js";
import { UNSUPPORTED_PAGE_ERROR } from "../../constants.js";
import { contentScreenshotCrop } from "./crop.js";
import { contentScreenshotLoad } from "./load.js";

/** Requests a tab screenshot from the service worker and crops the selection. */
async function contentScreenshotCapture(selection) {
  try {
    const response = await chrome.runtime.sendMessage({
      action: MESSAGES.CAPTURE_TAB,
    });

    if (!response?.success || !response?.imageData) {
      throw new Error(response?.error || UNSUPPORTED_PAGE_ERROR);
    }

    const img = await contentScreenshotLoad(response.imageData);

    return contentScreenshotCrop(img, selection);
  } catch (error) {
    console.warn("[scan-content] contentScreenshotCapture failed", error);
    throw error;
  }
}

export { contentScreenshotCapture };
