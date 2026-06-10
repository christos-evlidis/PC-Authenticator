import { qrSetupActionsPanelOpen } from "../panel/open.js";
import { qrSetupActionsInstant } from "../instant.js";
import { QR_SETUP_GUIDE_TEXT_SELECTOR } from "../../constants.js";

/** Opens QR setup and shows a scan/add error message. */
async function qrSetupActionsScanError(options = {}) {
  const { instantOpen = false, message } = options;

  if (instantOpen) {
    qrSetupActionsInstant();
  } else {
    await qrSetupActionsPanelOpen();
  }

  const guideText = document.querySelector(QR_SETUP_GUIDE_TEXT_SELECTOR);

  if (guideText) {
    guideText.textContent =
      message || "Could not add this account. Tap the QR button to try again.";
    guideText.classList.remove("is-hidden");
  }
}

export { qrSetupActionsScanError };
