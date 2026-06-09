import { cross } from "../../section-cross.js";
import { manualSetupPanelOpenAnimation } from "../animations/panel-open.js";
import { manualSetupStateGet } from "../state.js";
import { manualSetupStateSet } from "../state.js";

/** Opens the manual setup panel and plays the entrance sequence. */
async function manualSetupPanelOpen() {
  if (manualSetupStateGet().isOpen || manualSetupStateGet().isSubmitting) {
    return;
  }

  if (cross.qrCodeSetup.isActive()) {
    await cross.qrCodeSetup.close();
  }

  manualSetupStateSet({ isOpen: true });
  await manualSetupPanelOpenAnimation();
}

export { manualSetupPanelOpen };
