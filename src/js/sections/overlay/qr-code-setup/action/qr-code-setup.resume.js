import { qrSetupAnimationCleanup, qrSetupAnimationResumeRun } from "../qr-code-setup.animation.js";
import { qrSetupStateGet, qrSetupStateRunIdNext, qrSetupStateSet } from "../qr-code-setup.state.js";
import { qrSetupPanelClose, qrSetupPanelOpen } from "./qr-code-setup.panel.js";
import { qrSetupPanelLockClear } from "./qr-code-setup.lock.js";


/** Cancels a pending QR scan resume operation. */
function qrSetupResumeCancel() {
  if (!qrSetupStateGet().stateScan && !qrSetupStateGet().stateResume) { // Stop when no scan or resume work is active.
    return; // Exit without changing state.
  }
  qrSetupStateRunIdNext("resume"); // Invalidate any in-flight resume animation.
  qrSetupStateRunIdNext("panel"); // Invalidate any in-flight panel animation.
  qrSetupStateSet({ stateScan: false, stateResume: false }); // Clear active scan and resume state.
}

/** Resumes a saved scan result and plays the QR setup result animation. */
async function qrSetupResume(result) {
  qrSetupStateSet({ stateScan: false, stateResume: true }); // Mark resume animation as active before it starts.
  try {
    if (!qrSetupStateGet().statePanel) { // Open the panel with animation when it is not already visible.
      await qrSetupPanelOpen(); // Play the normal panel open animation before the result animation.
    }
    await qrSetupAnimationResumeRun(result); // Play the full resume success or failure animation.
    if (qrSetupStateGet().statePanel) { // Close only when the panel was not dismissed during the animation.
      await qrSetupPanelClose(); // Close the panel after the resume animation completes.
    }
  } finally {
    qrSetupStateSet({ stateResume: false }); // Clear resume state even when the animation is interrupted.
    qrSetupPanelLockClear(); // Ensure the body scroll lock is removed after resume ends.
    qrSetupAnimationCleanup(); // Tear down leftover resume animation classes and layout vars.
  }
}


export { qrSetupResumeCancel, qrSetupResume };
