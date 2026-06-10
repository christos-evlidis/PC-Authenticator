import { MESSAGES } from "./constants.js";
import { UNSUPPORTED_PAGE_ERROR } from "./constants.js";
import { messageWorker } from "./message/index.js";

/** Starts the QR scan overlay on the active tab. */
async function scanStart() {
  try {
    return await messageWorker({ action: MESSAGES.START });
  } catch (error) {
    console.warn("[scan] scanStart failed", error);
    throw error;
  }
}

/** Cancels an in-progress scan and clears pending state. */
async function scanCancel() {
  try {
    return await messageWorker({ action: MESSAGES.CANCEL });
  } catch (error) {
    console.warn("[scan] scanCancel failed", error);
    throw error;
  }
}

/** Reads the pending QR scan result from session storage. */
async function scanPendingGet() {
  try {
    return await messageWorker(
      { action: MESSAGES.GET_PENDING },
      { orError: false },
    );
  } catch (error) {
    console.warn("[scan] scanPendingGet failed", error);
    throw error;
  }
}

/** Clears the pending QR scan session entry. */
async function scanPendingClear() {
  try {
    return await messageWorker({ action: MESSAGES.CLEAR_PENDING });
  } catch (error) {
    console.warn("[scan] scanPendingClear failed", error);
    throw error;
  }
}

export { scanStart };
export { scanCancel };
export { scanPendingGet };
export { scanPendingClear };
export { UNSUPPORTED_PAGE_ERROR } from "./constants.js";
export { MESSAGES } from "./constants.js";
