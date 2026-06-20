import { appScanCancel, appScanStart } from "../../../../app/app.scan.js";
import { appStateGet } from "../../../../app/app.state.js";

import { qrSetupResume } from "./qr-code-setup.resume.js";
import { qrSetupStateGet, qrSetupStateSet } from "../qr-code-setup.state.js";
import { qrSetupPanelOpen } from "./qr-code-setup.panel.js";


async function _qrSetupScanCancel() {
  qrSetupStateSet({ stateScan: false });
  await appScanCancel();
}

async function _qrSetupScanFail() {
  if (!qrSetupStateGet().statePanel) {
    await qrSetupPanelOpen();
  }
  await qrSetupResume(false);
}

async function _qrSetupScanStart() {
  if (!appStateGet().stateAuth) {
    await _qrSetupScanFail();
    return;
  }
  await qrSetupPanelOpen();
  qrSetupStateSet({ stateScan: true });
  const response = await appScanStart();
  if (!response?.success) {
    qrSetupStateSet({ stateScan: false });
    await qrSetupResume(false);
  }
}

export { _qrSetupScanCancel as qrSetupScanCancel, _qrSetupScanStart as qrSetupScanStart };
