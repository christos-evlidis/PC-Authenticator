import { appScanCancel } from "../../../../app/app.scan.js";

import { qrSetupAnimationCleanup, qrSetupAnimationPanelClose, qrSetupAnimationPanelOpen } from "../qr-code-setup.animation.js";
import { qrSetupStateGet, qrSetupStateRunIdNext, qrSetupStateSet } from "../qr-code-setup.state.js";
import { qrSetupPanelLockApply, qrSetupPanelLockClear } from "./qr-code-setup.lock.js";


async function _qrSetupPanelClose() {
  if (!qrSetupStateGet().statePanel) {
    return;
  }
  if (qrSetupStateGet().stateScan) {
    await appScanCancel();
  }
  qrSetupStateRunIdNext("resume");
  qrSetupStateRunIdNext("panel");
  qrSetupStateSet({
    statePanel: false,
    stateScan: false,
    stateResume: false,
  });
  qrSetupPanelLockClear();
  qrSetupAnimationCleanup();
  await qrSetupAnimationPanelClose();
}

async function _qrSetupPanelOpen() {
  if (qrSetupStateGet().statePanel) {
    return;
  }
  qrSetupStateSet({ statePanel: true });
  qrSetupPanelLockApply();
  await qrSetupAnimationPanelOpen();
}

export { _qrSetupPanelClose as qrSetupPanelClose, _qrSetupPanelOpen as qrSetupPanelOpen };
