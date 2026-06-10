import { BODY_AUTH_FLOW_LOCK_CLASS } from "../../qr-code-setup-const.js";

function qrSetupActionsLockSet(isLocked) {
  document.body.classList.toggle(BODY_AUTH_FLOW_LOCK_CLASS, isLocked);
}

export { qrSetupActionsLockSet };
