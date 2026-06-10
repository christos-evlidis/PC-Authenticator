import { BODY_AUTH_FLOW_LOCK_CLASS } from "../../constants.js";

/** Toggles the auth-flow lock on the document body. */
function qrSetupActionsLockSet(isLocked) {
  document.body.classList.toggle(BODY_AUTH_FLOW_LOCK_CLASS, isLocked);
}

export { qrSetupActionsLockSet };
