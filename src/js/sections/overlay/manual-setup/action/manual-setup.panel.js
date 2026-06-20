import { manualSetupAnimationOpen, manualSetupAnimationClose } from "../manual-setup.animation.js";
import { manualSetupStateGet, manualSetupStateSet } from "../manual-setup.state.js";

async function _manualSetupPanelOpen() {
  if (manualSetupStateGet().isOpen || manualSetupStateGet().isSubmitting) {
    return;
  }
  manualSetupStateSet({ isOpen: true });
  await manualSetupAnimationOpen();
}

async function _manualSetupPanelClose() {
  if (!manualSetupStateGet().isOpen || manualSetupStateGet().isSubmitting) {
    return;
  }
  manualSetupStateSet({ isOpen: false, isSubmitting: false });
  await manualSetupAnimationClose();
}

export { _manualSetupPanelClose as manualSetupPanelClose, _manualSetupPanelOpen as manualSetupPanelOpen };
