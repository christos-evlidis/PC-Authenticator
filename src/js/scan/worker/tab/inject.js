import { MESSAGES } from "../constants.js";
import { messageContent } from "../../message/index.js";

const CONTENT_INDEX_PATH = "js/scan/content/index.js";

/** Injects scan content modules and registers listeners when a scan starts. */
async function workerTabInject(tabId) {
  try {
    const [result] = await chrome.scripting.executeScript({
      target: { tabId },
      func: async (contentIndexPath) => {
        if (window.pcAuthQrScanLoaded) {
          return true;
        }

        const { contentScriptInit } = await import(
          chrome.runtime.getURL(contentIndexPath)
        );

        contentScriptInit();
        window.pcAuthQrScanLoaded = true;

        return true;
      },
      args: [CONTENT_INDEX_PATH],
    });

    return { ok: result?.result === true };
  } catch (error) {
    return { ok: false, error };
  }
}

/** Returns whether the tab content script is loaded and responding. */
async function workerWaitForContent(tabId) {
  const result = await messageContent(tabId, MESSAGES.PING);

  return result.ok && result.response?.loaded;
}

export { workerTabInject };
export { workerWaitForContent };
