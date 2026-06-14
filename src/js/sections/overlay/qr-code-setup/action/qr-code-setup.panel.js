import { appScanCancel } from "../../../../app/app.scan.js";

import { qrSetupAnimationCleanup, qrSetupAnimationPanelClose, qrSetupAnimationPanelOpen } from "../qr-code-setup.animation.js";
import { qrSetupStateGet, qrSetupStateRunIdNext, qrSetupStateSet } from "../qr-code-setup.state.js";
import { qrSetupPanelLockApply, qrSetupPanelLockClear } from "./qr-code-setup.lock.js";


/** Closes the QR setup panel with animations and scan cleanup. */
async function qrSetupPanelClose() {
  if (!qrSetupStateGet().statePanel) { // Stop when the panel is already closed.
    return; // Exit without running the close animation.
  }
  if (qrSetupStateGet().stateScan) { // Cancel only when a tab scan overlay is still active.
    await appScanCancel(); // Tear down the in-page scan overlay and clear pending storage.
  }
  qrSetupStateRunIdNext("resume"); // Abort any in-flight resume animation.
  qrSetupStateRunIdNext("panel"); // Abort any in-flight panel animation.
  qrSetupStateSet({
    statePanel: false, // Mark the panel as closed before the animation runs.
    stateScan: false, // Clear any active scan state during close.
    stateResume: false, // Clear any active resume animation state during close.
  });
  qrSetupPanelLockClear(); // Restore background scrolling before the close animation.
  qrSetupAnimationCleanup(); // Reset resume classes and layout vars before the close animation.
  await qrSetupAnimationPanelClose(); // Play the panel close slide and backdrop fade.
}

/** Opens the QR setup panel with animations. */
async function qrSetupPanelOpen() {
  if (qrSetupStateGet().statePanel) { // Stop when the panel is already open.
    return; // Exit without running the open animation.
  }
  qrSetupStateSet({ statePanel: true }); // Mark the panel as open before the animation runs.
  qrSetupPanelLockApply(); // Block background scrolling while the panel is open.
  await qrSetupAnimationPanelOpen(); // Play the panel open slide and blur animation.
}


export { qrSetupPanelClose, qrSetupPanelOpen };
