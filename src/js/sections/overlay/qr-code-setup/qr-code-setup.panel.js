import { BODY_AUTH_FLOW_LOCK_CLASS, QR_SETUP_ACTIVE_CLASS, QR_SETUP_HEADER_BTN_ACTIVE_CLASS, QR_SETUP_OPEN_CLASS, QR_SETUP_PANEL_OPEN_CLASS } from "./qr-code-setup.constants.js";
import { qrSetupDomGet } from "./qr-code-setup.dom.js";
import { qrSetupStateGet, qrSetupStateSet } from "./qr-code-setup.state.js";
import { qrSetupScanCancel } from "./qr-code-setup.scan.js";
import { qrSetupAnimationPanelClose, qrSetupAnimationPanelOpen } from "./qr-code-setup.animation.js";

// Removes the scroll lock from the document body.
function qrSetupPanelLockClear() {
  document.body.classList.remove(BODY_AUTH_FLOW_LOCK_CLASS);
}

// Applies a scroll lock to the document body to prevent background scrolling.
function qrSetupPanelLockSet(isLocked) {
  document.body.classList.toggle(BODY_AUTH_FLOW_LOCK_CLASS, isLocked);
}

// Instantly displays the QR setup panel without animations.
function qrSetupPanelInstant() {
  const dom = qrSetupDomGet();

  if (!dom.root || qrSetupStateGet().statePanel) {
    return false;
  }

  dom.openBtns.forEach((button) => {
    button.classList.toggle(QR_SETUP_HEADER_BTN_ACTIVE_CLASS, true);
  });
  
  dom.root.classList.add(QR_SETUP_ACTIVE_CLASS, QR_SETUP_OPEN_CLASS, QR_SETUP_PANEL_OPEN_CLASS);
  qrSetupStateSet({ statePanel: true });

  return true;
}

// Closes the QR setup panel gracefully with animations.
async function qrSetupPanelClose() {
  if (!qrSetupStateGet().statePanel) {
    return;
  }

  await qrSetupScanCancel();

  qrSetupStateSet({
    statePanel: false,
    stateScan: false,
  });
  qrSetupPanelLockClear();
  await qrSetupAnimationPanelClose();
}

// Opens the QR setup panel gracefully with animations.
async function qrSetupPanelOpen() {
  if (qrSetupStateGet().statePanel) {
    return;
  }

  qrSetupStateSet({ statePanel: true });
  await qrSetupAnimationPanelOpen();
}

export {
  qrSetupPanelLockSet,
  qrSetupPanelInstant,
  qrSetupPanelClose,
  qrSetupPanelOpen,
};
