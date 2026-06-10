import { workerHandleAbort } from "./handle/abort.js";
import { workerHandleCapture } from "./handle/capture.js";
import { workerHandleSelection } from "./handle/selection.js";
import { workerHandleStart } from "./handle/start.js";
import { workerHandleTarget } from "./handle/target.js";
import { workerStoragePendingClear } from "./storage/pending/clear.js";
import { workerStoragePendingGet } from "./storage/pending/get.js";

import { MESSAGES } from "../constants.js";
import { UNSUPPORTED_PAGE_ERROR } from "../constants.js";

function workerScriptInit() {
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    const { action } = message;

    if (action === MESSAGES.CANCELLED_EVENT) {
      workerHandleAbort({ removeTabOverlay: false });
      return false;
    }

    const asyncActions = {
      [MESSAGES.START]: () => workerHandleStart(),
      [MESSAGES.GET_SCAN_TARGET]: () => workerHandleTarget(),
      [MESSAGES.CAPTURE_TAB]: () => workerHandleCapture(),
      [MESSAGES.SCAN_QR_CODE]: () => workerHandleSelection(message),
      [MESSAGES.GET_PENDING]: () => workerStoragePendingGet(),
      [MESSAGES.CLEAR_PENDING]: async () => {
        await workerStoragePendingClear();
        return { success: true };
      },
      [MESSAGES.CANCEL]: () => workerHandleAbort({ removeTabOverlay: true }),
    };

    const run = asyncActions[action];

    if (!run) {
      return false;
    }

    run()
      .then((result) => {
        sendResponse(
          result ?? { success: false, error: UNSUPPORTED_PAGE_ERROR },
        );
      })
      .catch((error) => {
        console.warn("[scan-worker] message handler failed", error);
        sendResponse({ success: false, error: UNSUPPORTED_PAGE_ERROR });
      });

    return true;
  });
}

workerScriptInit();

export { workerScriptInit };
