import { appScanCancel, appScanStart } from "../../../../app/app.scan.js";
import { appStateGet } from "../../../../app/app.state.js";

import { qrSetupResume } from "./qr-code-setup.resume.js";
import { qrSetupStateGet, qrSetupStateSet } from "../qr-code-setup.state.js";
import { qrSetupPanelOpen } from "./qr-code-setup.panel.js";


/** Cancels the active QR scan and clears scan state. */
async function qrSetupScanCancel() {
  qrSetupStateSet({ stateScan: false }); // Mark the scan session as inactive.
  await appScanCancel(); // Delegate scan cancellation to the app scan layer.
}

/** Opens the panel when needed and plays the scan failure result animation. */
async function qrSetupScanFail() {
  if (!qrSetupStateGet().statePanel) { // Open the panel first when it is not already visible.
    await qrSetupPanelOpen(); // Show the QR setup panel before playing the failure animation.
  }
  await qrSetupResume(false); // Play the error result animation with the X icon.
}

/** Starts a new QR scan from the header scan button flow. */
async function qrSetupScanStart() {
  if (!appStateGet().stateAuth) { // Stop when scan is requested while signed out.
    await qrSetupScanFail(); // Play the error animation without changing the guide text.
    return; // Exit without starting a scan session.
  }
  await qrSetupPanelOpen(); // Open the panel with the default guide text still in place.
  qrSetupStateSet({ stateScan: true }); // Mark the scan session as active.
  const response = await appScanStart(); // Delegate scan start to the app scan layer.
  if (!response?.success) { // Handle scan start failures from the content script.
    qrSetupStateSet({ stateScan: false }); // Clear active scan state after a failed start.
    await qrSetupResume(false); // Play the error result animation with the X icon.
  }
}


export { qrSetupScanCancel, qrSetupScanStart };
