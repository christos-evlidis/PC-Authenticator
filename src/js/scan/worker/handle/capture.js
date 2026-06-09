import { START_FAILED_ERROR } from "../../constants.js";
import { workerTabCapture } from "../tab/capture.js";
import { workerTabResolve } from "../tab/resolve.js";

/** Captures the visible tab for content-script cropping. */
async function workerHandleCapture() {
  const { tab, error } = await workerTabResolve();

  if (!tab) {
    return { success: false, error };
  }

  try {
    const imageData = await workerTabCapture(tab.windowId);

    if (!imageData) {
      return { success: false, error: START_FAILED_ERROR };
    }

    return { success: true, imageData };
  } catch (caught) {
    const message =
      caught instanceof Error ? caught.message : String(caught ?? "");
    const detail = message
      ? `${START_FAILED_ERROR} (${message})`
      : START_FAILED_ERROR;

    return { success: false, error: detail };
  }
}

export { workerHandleCapture };
