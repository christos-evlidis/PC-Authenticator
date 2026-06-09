import { CONTENT_SCRIPT_PATH } from "../../scan-constants.js";
import { QR_SCAN_MESSAGES } from "../../scan-constants.js";
import { scanTabMessage } from "../../messaging/index.js";

/** Injects the QR selection content script into a tab. */
async function scanOverlayInject(tabId) {
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
async function scanContentReadyWait(tabId) {
  const result = await scanTabMessage(tabId, QR_SCAN_MESSAGES.PING);

  return result.ok && result.response?.loaded;
}

export { scanOverlayInject };
export { scanContentReadyWait };
