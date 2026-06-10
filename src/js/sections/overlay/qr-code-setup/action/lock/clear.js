import { BODY_AUTH_FLOW_LOCK_CLASS } from "../../constants.js";

function qrSetupActionsLockClear() {
  document.body.classList.remove(BODY_AUTH_FLOW_LOCK_CLASS);
}

export { qrSetupActionsLockClear };
