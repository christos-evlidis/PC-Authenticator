import { MESSAGES } from "./message/constants.js";
import { UNSUPPORTED_PAGE_ERROR } from "./message/constants.js";
import { messageWorker } from "./message/index.js";

/** Starts the QR scan overlay on the active tab. */
async function scanStart() {
  return messageWorker({ action: MESSAGES.START });
}

/** Cancels an in-progress scan and clears pending state. */
async function scanCancel() {
  return messageWorker({ action: MESSAGES.CANCEL });
}

/** Reads the pending QR scan result from session storage. */
async function scanPendingGet() {
  return messageWorker(
    { action: MESSAGES.GET_PENDING },
    { orError: false },
  );
}

/** Clears the pending QR scan session entry. */
async function scanPendingClear() {
  return messageWorker({ action: MESSAGES.CLEAR_PENDING });
}

export { scanStart };
export { scanCancel };
export { scanPendingGet };
export { scanPendingClear };
export { UNSUPPORTED_PAGE_ERROR };
export { MESSAGES };
