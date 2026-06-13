import { qrSetupDomGet, qrSetupDomSet } from "../qr-code-setup.dom.js";
import { qrSetupStateGet, qrSetupStateSet } from "../qr-code-setup.state.js";
import { qrSetupScanCancel } from "./qr-code-setup.scan.js";
import { qrSetupAnimationPanelClose, qrSetupAnimationPanelOpen } from "../qr-code-setup.animation.js";
import { qrSetupPanelLockClear, qrSetupPanelLockSet } from "./qr-code-setup.lock.js";


// Closes the QR setup panel gracefully with animations.
async function qrSetupPanelClose() {
  if (!qrSetupStateGet().statePanel) { return; }
  await qrSetupScanCancel();
  qrSetupStateSet({ statePanel: false, stateScan: false, });
  qrSetupPanelLockClear();
  await qrSetupAnimationPanelClose();
}

// Opens the QR setup panel gracefully with animations.
async function qrSetupPanelOpen() {
  if (qrSetupStateGet().statePanel) { return; }
  qrSetupStateSet({ statePanel: true });
  qrSetupPanelLockSet();
  await qrSetupAnimationPanelOpen();
}


export {
  qrSetupPanelClose,
  qrSetupPanelOpen,
};
