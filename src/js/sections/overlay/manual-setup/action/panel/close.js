import { manualSetupAnimationClose } from "../../animation/close.js";
import { manualSetupStateGet } from "../../state/get.js";
import { manualSetupStateSet } from "../../state/set.js";

async function manualSetupActionsPanelClose() {
  if (!manualSetupStateGet().isOpen || manualSetupStateGet().isSubmitting) {
    return;
  }

  manualSetupStateSet({ isOpen: false, isSubmitting: false });
  await manualSetupAnimationClose();
}

export { manualSetupActionsPanelClose };
