import { BODY_AUTH_FLOW_LOCK_CLASS } from "../../qr-code-setup-const.js";

/** Removes the auth-flow body lock class. */
function qrSetupActionLockClear() {
  document.body.classList.remove(BODY_AUTH_FLOW_LOCK_CLASS);
}

export { qrSetupActionLockClear };
