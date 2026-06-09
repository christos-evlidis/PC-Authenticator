import { MESSAGES } from "../../constants.js";
import { START_FAILED_ERROR } from "../../constants.js";
import { workerTabInject } from "../tab/inject.js";
import { workerWaitForContent } from "../tab/inject.js";
import { workerTabResolve } from "../tab/resolve.js";
import { messageContent } from "../../message/index.js";

/** Starts the overlay selection flow on the active tab. */
async function workerHandleStart() {
  const { tab, error } = await workerTabResolve();

  if (!tab) {
    return { success: false, error };
  }

  const injected = await workerTabInject(tab.id);

  if (!injected.ok) {
    console.warn("[scan] injectSelectionOverlay failed", injected.error);

    const message =
      injected.error instanceof Error
        ? injected.error.message
        : String(injected.error ?? "");
    const detail = message
      ? `${START_FAILED_ERROR} (${message})`
      : START_FAILED_ERROR;

    return { success: false, error: detail };
  }

  const ready = await workerWaitForContent(tab.id);

  if (!ready) {
    return {
      success: false,
      error: `${START_FAILED_ERROR} (QR scanner did not load in time.)`,
    };
  }

  const messaged = await messageContent(tab.id, MESSAGES.START_OVERLAY);

  if (!messaged.ok) {
    console.warn("[scan] messageTab failed", messaged.error);

    const message =
      messaged.error instanceof Error
        ? messaged.error.message
        : String(messaged.error ?? "");
    const detail = message
      ? `${START_FAILED_ERROR} (${message})`
      : START_FAILED_ERROR;

    return { success: false, error: detail };
  }

  return { success: true };
}

export { workerHandleStart };
