import { qrSetupActionsLockClear } from "../lock/clear.js";
import { qrSetupActionsScanCancel } from "../scan/cancel.js";
import { qrSetupAnimationPanelClose } from "../../animation/panel/close.js";
import { qrSetupStateGet } from "../../state/get.js";
import { qrSetupStateSet } from "../../state/set.js";

async function qrSetupActionsPanelClose() {
  if (!qrSetupStateGet().isOpen) {
    return;
  }

  await qrSetupActionsScanCancel();

  qrSetupStateSet({
    isOpen: false,
    isBusy: false,
    isAwaitingPageSelection: false,
  });
  qrSetupActionsLockClear();
  await qrSetupAnimationPanelClose();
}

export { qrSetupActionsPanelClose };
