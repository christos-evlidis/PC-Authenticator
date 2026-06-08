import { QR_SETUP_GUIDE_SELECTION_TEXT } from "./constants.js";
import { QR_SETUP_GUIDE_TEXT_SELECTOR } from "./constants.js";

/** Sets the QR setup guide message text. */
function qrSetupGuideSetText(text) {
  const guideText = document.querySelector(QR_SETUP_GUIDE_TEXT_SELECTOR);

  if (guideText) {
    guideText.textContent = text;
  }
}

/** Shows or hides the QR setup guide message text. */
function qrSetupGuideSetCopyVisible(isVisible) {
  document
    .querySelector(QR_SETUP_GUIDE_TEXT_SELECTOR)
    ?.classList.toggle("is-hidden", !isVisible);
}

/** Resets the QR setup guide to its default selection message. */
function qrSetupGuideReset() {
  qrSetupGuideSetText(QR_SETUP_GUIDE_SELECTION_TEXT);
  qrSetupGuideSetCopyVisible(true);
}

export { qrSetupGuideReset };
export { qrSetupGuideSetCopyVisible };
export { qrSetupGuideSetText };
