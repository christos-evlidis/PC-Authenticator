import { qrSetupPanelClose } from "../../../qr-code-setup/qr-code-setup.index.js";
import { qrSetupStateGet } from "../../../qr-code-setup/qr-code-setup.state.js";
import { manualSetupAnimationOpen } from "../../animation/open.js";
import { manualSetupStateGet } from "../../state/get.js";
import { manualSetupStateSet } from "../../state/set.js";

/** Opens the manual-setup panel and closes QR setup if open. */
async function manualSetupActionPanelOpen() {
  if (manualSetupStateGet().isOpen || manualSetupStateGet().isSubmitting) {
    return;
  }

  if (qrSetupStateGet().isOpen) {
    await qrSetupPanelClose();
  }

  manualSetupStateSet({ isOpen: true });
  await manualSetupAnimationOpen();
}

export { manualSetupActionPanelOpen };
