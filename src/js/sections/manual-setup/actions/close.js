import { manualSetupPanelCloseAnimation } from "../animations/panel-close.js";
import { manualSetupStateGet } from "../state.js";
import { manualSetupStateSet } from "../state.js";

/** Closes the manual setup panel when it is open and not submitting. */
async function manualSetupPanelClose() {
  if (!manualSetupStateGet().isOpen || manualSetupStateGet().isSubmitting) {
    return;
  }

  manualSetupStateSet({ isOpen: false, isSubmitting: false });
  await manualSetupPanelCloseAnimation();
}

export { manualSetupPanelClose };
