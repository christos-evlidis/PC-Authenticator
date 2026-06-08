import { BODY_AUTH_FLOW_LOCK_CLASS } from "../constants.js";
import { qrSetupPanelCloseAnimation } from "../animations/panel-close.js";
import { qrSetupGuideReset } from "../guide.js";
import { qrSetupStateGet } from "../state.js";
import { qrSetupStateSet } from "../state.js";

/** Clears the auth-flow lock on the document body. */
function qrSetupAuthFlowLockClear() {
  document.body.classList.remove(BODY_AUTH_FLOW_LOCK_CLASS);
}

/** Closes the QR setup panel when it is open. */
async function qrSetupPanelClose(cancelPageSelection) {
  if (!qrSetupStateGet().isOpen) {
    return;
  }

  qrSetupStateSet({
    isOpen: false,
    isBusy: false,
    isAwaitingPageSelection: false,
  });
  qrSetupAuthFlowLockClear();

  await cancelPageSelection?.();
  await qrSetupPanelCloseAnimation();
  qrSetupGuideReset();
}

export { qrSetupPanelClose };
export { qrSetupAuthFlowLockClear };
