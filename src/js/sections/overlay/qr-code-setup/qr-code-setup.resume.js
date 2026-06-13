import { qrSetupStateGet, qrSetupStateSet } from "./qr-code-setup.state.js";
import { qrSetupPanelClose } from "./qr-code-setup.panel.js";
import { qrSetupAnimationResumeRun, qrSetupAnimationResumeFinish } from "./qr-code-setup.animation.js";

// Cancels a pending resume operation.
function qrSetupResumeCancel() {
  if (!qrSetupStateGet().stateScan) {
    return;
  }

  qrSetupStateSet({ stateScan: false });
}

// Executes the UI changes for a resumed operation.
async function qrSetupResumePerform(scanResult) {
  qrSetupStateSet({ stateScan: false });

  await qrSetupAnimationResumeRun(scanResult);

  await qrSetupPanelClose();
  qrSetupAnimationResumeFinish();
}

export { qrSetupResumeCancel, qrSetupResumePerform };
