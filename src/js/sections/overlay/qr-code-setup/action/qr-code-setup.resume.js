import { scanPendingClear, scanPendingGet } from "../../../../services/scan/scan-index.js";
import { appActionAddQr } from "../../../../app/app.actions.js";
import { qrSetupStateGet, qrSetupStateSet } from "../qr-code-setup.state.js";
import { qrSetupPanelClose, qrSetupPanelOpen } from "./qr-code-setup.panel.js";
import { qrSetupAnimationRun, qrSetupAnimationFinish } from "../qr-code-setup.animation.js";


// Cancels a pending resume operation.
function qrSetupResumeCancel() {
  if (!qrSetupStateGet().stateScan) { return; }
  qrSetupStateSet({ stateScan: false });
}

// Executes the UI changes for a resumed operation.
async function qrSetupResumePerform(scanResult) {
  qrSetupStateSet({ stateScan: false });
  void qrSetupPanelOpen();
  await qrSetupAnimationRun(scanResult);
  await qrSetupPanelClose();
  qrSetupAnimationFinish();
}

// Processes a pending scan operation when the application is resumed.
async function qrSetupResumePending(pending) {
  if (!pending) { return; }
  await scanPendingClear();
  let scanResult = false;
  if (pending.status === "ready" && pending.uri) {
    try {
      const addedAccount = await appActionAddQr(pending.uri);
      scanResult = !!addedAccount;
    } catch {
      scanResult = false;
    }
  }
  await qrSetupResumePerform(scanResult);
}

// Checks if there is a pending scan operation waiting to be resumed.
async function qrSetupResumeCheck() {
  try {
    const pending = await scanPendingGet();

    if (pending?.status !== "ready" && pending?.status !== "error") {
      return false;
    }

    void qrSetupResumePending(pending);
    return true;
  } catch (error) {
    console.warn("[qr-code-setup.resume] qrSetupResumeCheck failed", error);
    return false;
  }
}


export { qrSetupResumeCancel, qrSetupResumePerform, qrSetupResumeCheck };
