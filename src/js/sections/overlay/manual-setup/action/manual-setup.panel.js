import { manualSetupAnimationOpen, manualSetupAnimationClose } from "../manual-setup.animation.js";
import { manualSetupStateGet, manualSetupStateSet } from "../manual-setup.state.js";

/** Opens the manual-setup panel. */
async function manualSetupPanelOpen() {
  if (manualSetupStateGet().isOpen || manualSetupStateGet().isSubmitting) {
    return;
  }
  manualSetupStateSet({ isOpen: true });
  await manualSetupAnimationOpen();
}

/** Closes the manual-setup panel. */
async function manualSetupPanelClose() {
  if (!manualSetupStateGet().isOpen || manualSetupStateGet().isSubmitting) {
    return;
  }
  manualSetupStateSet({ isOpen: false, isSubmitting: false });
  await manualSetupAnimationClose();
}

export { manualSetupPanelClose, manualSetupPanelOpen };
