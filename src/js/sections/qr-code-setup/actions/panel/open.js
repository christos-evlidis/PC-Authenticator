import { cross } from "../../../section-cross.js";
import { manualSetupStateGet } from "../../../manual-setup/state/get.js";
import { qrSetupAnimationOpen } from "../../animation/open.js";
import { QR_SETUP_GUIDE_SELECTION_TEXT } from "../../constants.js";
import { QR_SETUP_GUIDE_TEXT_SELECTOR } from "../../constants.js";
import { qrSetupStateGet } from "../../state/get.js";
import { qrSetupStateSet } from "../../state/set.js";

/** Opens the QR setup panel and plays the entrance sequence. */
async function qrSetupActionsPanelOpen() {
  if (qrSetupStateGet().isOpen) {
    return;
  }

  if (manualSetupStateGet().isOpen) {
    await cross.manualSetup.close();
  }

  const guideText = document.querySelector(QR_SETUP_GUIDE_TEXT_SELECTOR);

  if (guideText) {
    guideText.textContent = QR_SETUP_GUIDE_SELECTION_TEXT;
    guideText.classList.remove("is-hidden");
  }

  qrSetupStateSet({ isOpen: true });
  await qrSetupAnimationOpen();
}

export { qrSetupActionsPanelOpen };
