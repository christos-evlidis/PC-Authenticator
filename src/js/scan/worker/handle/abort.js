import { MESSAGES } from "../../constants.js";
import { workerStoragePendingClear } from "../storage/pending/clear.js";
import { workerTabResolve } from "../tab/resolve.js";
import { messageContent } from "../../message/index.js";

/** Aborts an in-progress scan and optionally removes the tab overlay. */
async function workerHandleAbort(options = {}) {
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
}

export { workerHandleAbort };
