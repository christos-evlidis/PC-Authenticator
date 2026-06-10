import { START_FAILED_ERROR } from "../../constants.js";
import { workerTabCapture } from "../tab/capture.js";
import { workerTabResolve } from "../tab/resolve.js";

/** Captures the visible tab for content-script cropping. */
async function workerHandleCapture() {
  try {
    const { tab, error } = await workerTabResolve();

    if (!tab) {
      return { success: false, error };
    }

    const imageData = await workerTabCapture(tab.windowId);

    if (!imageData) {
      return { success: false, error: START_FAILED_ERROR };
    }

    return { success: true, imageData };
  } catch (error) {
    console.warn("[scan-handle] workerHandleCapture failed", error);

    const message =
      error instanceof Error ? error.message : String(error ?? "");
    const detail = message
      ? `${START_FAILED_ERROR} (${message})`
      : START_FAILED_ERROR;

    return { success: false, error: detail };
  }
}

export { workerHandleCapture };
