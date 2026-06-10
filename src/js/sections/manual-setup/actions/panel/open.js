import { cross } from "../../../section-cross.js";
import { qrSetupStateGet } from "../../../qr-code-setup/state/get.js";
import { manualSetupAnimationOpen } from "../../animation/open.js";
import { manualSetupStateGet } from "../../state/get.js";
import { manualSetupStateSet } from "../../state/set.js";

/** Opens the manual setup panel and plays the entrance sequence. */
async function manualSetupActionsPanelOpen() {
  if (manualSetupStateGet().isOpen || manualSetupStateGet().isSubmitting) {
    return;
  }

  if (qrSetupStateGet().isOpen) {
    await cross.qrCodeSetup.close();
  }

  manualSetupStateSet({ isOpen: true });
  await manualSetupAnimationOpen();
}

export { manualSetupActionsPanelOpen };
