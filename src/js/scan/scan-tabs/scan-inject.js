import { CONTENT_SCRIPT_PATH } from "../scan-constants.js";
import { QR_SCAN_MESSAGES } from "../scan-constants.js";
import { qrScanTabMessage } from "./scan-messaging.js";

/** Injects the QR selection content script into a tab. */
export async function qrScanOverlayInject(tabId) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: [CONTENT_SCRIPT_PATH],
    });

    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}

/** Waits until the injected content script responds to ping. */
export async function qrScanContentReadyWait(tabId) {
  const result = await qrScanTabMessage(tabId, QR_SCAN_MESSAGES.PING);

  return result.ok && result.response?.loaded;
}
