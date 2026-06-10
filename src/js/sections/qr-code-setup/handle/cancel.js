import { QR_SETUP_GUIDE_TEXT_SELECTOR } from "../constants.js";
import { qrSetupStateSet } from "../state/set.js";

/** Handles a cancelled QR scan message from the extension runtime. */
function qrSetupHandleCancel() {
  qrSetupStateSet({ isAwaitingPageSelection: false });

  const guideText = document.querySelector(QR_SETUP_GUIDE_TEXT_SELECTOR);

  if (guideText) {
    guideText.textContent = "Scan cancelled. Tap the QR button to try again.";
  }
}

export { qrSetupHandleCancel };
