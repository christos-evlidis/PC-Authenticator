import { qrSetupActionPanelClose } from "../../../qr-code-setup/action/panel/close.js";
import { qrSetupStateGet } from "../../../qr-code-setup/state/get.js";

import { manualSetupAnimationOpen } from "../../animation/open.js";
import { manualSetupStateGet } from "../../state/get.js";
import { manualSetupStateSet } from "../../state/set.js";

/** Opens the manual-setup panel and closes QR setup if open. */
async function manualSetupActionPanelOpen() {
  if (manualSetupStateGet().isOpen || manualSetupStateGet().isSubmitting) {
    return;
  }

  if (qrSetupStateGet().isOpen) {
    await qrSetupActionPanelClose();
  }

  manualSetupStateSet({ isOpen: true });
  await manualSetupAnimationOpen();
}

export { manualSetupActionPanelOpen };
