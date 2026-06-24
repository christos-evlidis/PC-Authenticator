import { appScanCancel } from "../../../../app/app.scan.js";
import { qrSetupStateGet, qrSetupStateRunIdNext, qrSetupStateSet } from "../qr-code-setup.state.js";
import { qrSetupPanelLockApply, qrSetupPanelLockClear } from "./qr-code-setup.lock.js";
import { qrSetupDomGet } from "../qr-code-setup.dom.js";
import { QR_SETUP_HIDDEN_CLASS, QR_SETUP_OPEN_CLASS } from "../../../../const/const.qr-setup.js";

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
  
  const dom = qrSetupDomGet();
  dom.root?.classList.add(QR_SETUP_HIDDEN_CLASS);
  dom.root?.classList.remove(QR_SETUP_OPEN_CLASS);
}

async function _qrSetupPanelOpen() {
  if (qrSetupStateGet().statePanel) {
    return;
  }
  qrSetupStateSet({ statePanel: true });
  qrSetupPanelLockApply();
  
  const dom = qrSetupDomGet();
  dom.root?.classList.remove(QR_SETUP_HIDDEN_CLASS);
  dom.root?.classList.add(QR_SETUP_OPEN_CLASS);
}

export { _qrSetupPanelClose as qrSetupPanelClose, _qrSetupPanelOpen as qrSetupPanelOpen };
