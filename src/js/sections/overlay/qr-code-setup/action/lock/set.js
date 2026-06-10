import { BODY_AUTH_FLOW_LOCK_CLASS } from "../../qr-code-setup-const.js";

/** Toggles the auth-flow body lock class. */
function qrSetupActionLockSet(isLocked) {
  document.body.classList.toggle(BODY_AUTH_FLOW_LOCK_CLASS, isLocked);
}

export { qrSetupActionLockSet };
