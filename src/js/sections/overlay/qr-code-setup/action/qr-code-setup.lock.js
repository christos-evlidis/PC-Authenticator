import { BODY_AUTH_FLOW_LOCK_CLASS } from "../../../../const/const.qr-code-setup.js";
import { qrSetupStateSet } from "../qr-code-setup.state.js";


// Removes the scroll lock from the document body.
function qrSetupPanelLockClear() {
  qrSetupStateSet({ stateLock: false });
  document.body.classList.remove(BODY_AUTH_FLOW_LOCK_CLASS);
}

// Applies a scroll lock to the document body to prevent background scrolling.
function qrSetupPanelLockSet() {
  qrSetupStateSet({ stateLock: true });
  document.body.classList.add(BODY_AUTH_FLOW_LOCK_CLASS);
}


export { qrSetupPanelLockClear, qrSetupPanelLockSet };
