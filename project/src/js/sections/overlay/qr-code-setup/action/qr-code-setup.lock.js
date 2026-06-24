import { BODY_AUTH_FLOW_LOCK_CLASS } from "../../../../const/const.qr-setup.js";


function _qrSetupPanelLockApply() {
  document.body.classList.add(BODY_AUTH_FLOW_LOCK_CLASS);
}

function _qrSetupPanelLockClear() {
  document.body.classList.remove(BODY_AUTH_FLOW_LOCK_CLASS);
}

export { _qrSetupPanelLockApply as qrSetupPanelLockApply, _qrSetupPanelLockClear as qrSetupPanelLockClear };
