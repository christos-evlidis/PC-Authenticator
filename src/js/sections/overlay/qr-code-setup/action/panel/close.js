import { qrSetupActionLockClear } from "../lock/clear.js";
import { qrSetupActionScanCancel } from "../scan/cancel.js";
import { qrSetupAnimationPanelClose } from "../../animation/panel/close.js";
import { qrSetupStateGet } from "../../state/get.js";
import { qrSetupStateSet } from "../../state/set.js";

/** Cancels scan, resets state, and closes the QR panel. */
async function qrSetupActionPanelClose() {
  if (!qrSetupStateGet().isOpen) {
    return;
  }

  await qrSetupActionScanCancel();

  qrSetupStateSet({
    isOpen: false,
    isBusy: false,
    isAwaitingPageSelection: false,
  });
  qrSetupActionLockClear();
  await qrSetupAnimationPanelClose();
}

export { qrSetupActionPanelClose };
