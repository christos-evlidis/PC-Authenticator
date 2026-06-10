import { BODY_AUTH_FLOW_LOCK_CLASS } from "../../constants.js";

/** Clears the auth-flow lock on the document body. */
function qrSetupActionsLockClear() {
  document.body.classList.remove(BODY_AUTH_FLOW_LOCK_CLASS);
}

export { qrSetupActionsLockClear };
