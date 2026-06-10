import { manualSetupAnimationOpen } from "../../animation/open.js";
import { manualSetupStateGet } from "../../state/get.js";
import { manualSetupStateSet } from "../../state/set.js";
import { qrSetupActionsPanelClose } from "../../../qr-code-setup/action/panel/close.js";
import { qrSetupStateGet } from "../../../qr-code-setup/state/get.js";

async function manualSetupActionsPanelOpen() {
  if (manualSetupStateGet().isOpen || manualSetupStateGet().isSubmitting) {
    return;
  }

  if (qrSetupStateGet().isOpen) {
    await qrSetupActionsPanelClose();
  }

  manualSetupStateSet({ isOpen: true });
  await manualSetupAnimationOpen();
}

export { manualSetupActionsPanelOpen };
