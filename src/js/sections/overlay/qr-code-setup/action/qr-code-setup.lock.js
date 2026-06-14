import { BODY_AUTH_FLOW_LOCK_CLASS } from "../../../../const/const.qr-setup.js";


/** Applies the document body scroll lock used during QR auth flows. */
function qrSetupPanelLockApply() {
  document.body.classList.add(BODY_AUTH_FLOW_LOCK_CLASS); // Block background scrolling during QR flows.
}

/** Removes the document body scroll lock used during QR auth flows. */
function qrSetupPanelLockClear() {
  document.body.classList.remove(BODY_AUTH_FLOW_LOCK_CLASS); // Allow background scrolling again.
}


export { qrSetupPanelLockApply, qrSetupPanelLockClear };
