import { qrSetupAnimationClose } from "../../animation/close.js";
import { qrSetupActionsScanCancel } from "../scan/cancel.js";
import { QR_SETUP_GUIDE_SELECTION_TEXT } from "../../constants.js";
import { QR_SETUP_GUIDE_TEXT_SELECTOR } from "../../constants.js";
import { qrSetupStateGet } from "../../state/get.js";
import { qrSetupStateSet } from "../../state/set.js";
import { qrSetupActionsLockClear } from "../lock/clear.js";

/** Closes the QR setup panel when it is open. */
async function qrSetupActionsPanelClose() {
  if (!qrSetupStateGet().isOpen) {
    return;
  }

  qrSetupStateSet({
    isOpen: false,
    isBusy: false,
    isAwaitingPageSelection: false,
  });
  qrSetupActionsLockClear();

  await qrSetupActionsScanCancel();
  await qrSetupAnimationClose();

  const guideText = document.querySelector(QR_SETUP_GUIDE_TEXT_SELECTOR);

  if (guideText) {
    guideText.textContent = QR_SETUP_GUIDE_SELECTION_TEXT;
    guideText.classList.remove("is-hidden");
  }
}

export { qrSetupActionsPanelClose };
