import { messageContent } from "../../message/message-index.js";
import { workerStoragePendingClear } from "../storage/pending/clear.js";
import { workerTabResolve } from "../tab/resolve.js";

import { MESSAGES } from "../../scan-const.js";

async function workerHandleAbort(options = {}) {
  try {
    const { removeTabOverlay = false } = options;

    if (removeTabOverlay) {
      const { tab } = await workerTabResolve();

      if (tab) {
        await messageContent(tab.id, MESSAGES.CANCEL_OVERLAY);
      }
    }

    await workerStoragePendingClear();
    chrome.runtime.sendMessage({ action: MESSAGES.CANCELLED_EVENT });

    return { success: true };
  } catch (error) {
    console.warn("[scan-handle] workerHandleAbort failed", error);
    throw error;
  }
}

export { workerHandleAbort };
