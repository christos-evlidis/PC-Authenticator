import { appActionScanCancel, appActionScanStart } from "../../../../app/app.actions.js";
import { appStateGet } from "../../../../app/app.state.js";
import { qrSetupStateGet, qrSetupStateSet } from "../qr-code-setup.state.js";
import { qrSetupPanelOpen } from "./qr-code-setup.panel.js";
import { qrSetupRenderGuide } from "../qr-code-setup.render.js";
import { QR_SETUP_GUIDE_SELECTION_TEXT } from "../../../../const/const.qr-code-setup.js";


// Cancels an ongoing QR code scan process.
async function qrSetupScanCancel() {
  qrSetupStateSet({ stateScan: false });

  await appActionScanCancel();
}

// Initiates a new QR code scan sequence.
async function qrSetupScanStart() {
  const isSignedIn = appStateGet().stateAuth;

  if (!isSignedIn) {
    return;
  }

  qrSetupRenderGuide(QR_SETUP_GUIDE_SELECTION_TEXT);
  void qrSetupPanelOpen();

  qrSetupStateSet({ stateScan: true });

  const response = await appActionScanStart();

  if (!response?.success) {
    qrSetupStateSet({ stateScan: false });
  }
}


export { qrSetupScanCancel, qrSetupScanStart };
