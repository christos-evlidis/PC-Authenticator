import { qrSetupStateGet, qrSetupStateRunIdNext, qrSetupStateSet } from "../qr-code-setup.state.js";
import { qrSetupPanelClose, qrSetupPanelOpen } from "./qr-code-setup.panel.js";
import { qrSetupPanelLockClear } from "./qr-code-setup.lock.js";

function _qrSetupResumeCancel() {
  if (!qrSetupStateGet().stateScan && !qrSetupStateGet().stateResume) {
    return;
  }
  qrSetupStateRunIdNext("resume");
  qrSetupStateRunIdNext("panel");
  qrSetupStateSet({ stateScan: false, stateResume: false });
}

async function _qrSetupResume(result) {
  qrSetupStateSet({ stateScan: false, stateResume: true });
  try {
    if (!qrSetupStateGet().statePanel) {
      await qrSetupPanelOpen();
    }
    if (qrSetupStateGet().statePanel) {
      await qrSetupPanelClose();
    }
  } finally {
    qrSetupStateSet({ stateResume: false });
    qrSetupPanelLockClear();
  }
}

export { _qrSetupResumeCancel as qrSetupResumeCancel, _qrSetupResume as qrSetupResume };
