import { appScanCancel, appScanStart, UNSUPPORTED_PAGE_ERROR } from "../../../app/app.scan.js";
import { appStateGet } from "../../../app/app.state.js";
import { qrSetupStateGet, qrSetupStateSet } from "./qr-code-setup.state.js";
import { qrSetupPanelOpen } from "./qr-code-setup.panel.js";
import { qrSetupDomSet } from "./qr-code-setup.dom.js";
import { QR_SETUP_GUIDE_SELECTION_TEXT, QR_SETUP_GUIDE_ERROR_TEXT } from "./qr-code-setup.constants.js";

// Cancels an ongoing QR code scan process.
async function qrSetupScanCancel() {
  qrSetupStateSet({ stateScan: false });
  await appScanCancel();
}

// Displays an error state if the scan fails or is unavailable.
async function qrSetupScanError() {
  qrSetupDomSet({ guideText: QR_SETUP_GUIDE_ERROR_TEXT });
  await qrSetupPanelOpen();
}

// Initiates a new QR code scan sequence.
async function qrSetupScanStart() {
  const isSignedIn = appStateGet().stateAuth;

  if (!isSignedIn) {
    await qrSetupScanError();
    return;
  }

  qrSetupDomSet({ guideText: QR_SETUP_GUIDE_SELECTION_TEXT });
  void qrSetupPanelOpen();

  qrSetupStateSet({ stateScan: true });

  const response = await appScanStart();

  if (!response?.success) {
    qrSetupStateSet({ stateScan: false });
    await qrSetupScanError();
  }
}

export { qrSetupScanCancel, qrSetupScanStart };
