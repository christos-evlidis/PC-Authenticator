import { qrSetupPanelClose, qrSetupPanelOpen } from "./action/qr-code-setup.panel.js";
import { qrSetupResumeCancel, qrSetupResume } from "./action/qr-code-setup.resume.js";
import { qrSetupScanCancel } from "./action/qr-code-setup.scan.js";
import { qrSetupEventsBind } from "./qr-code-setup.events.js";


/** Initializes the QR setup module and binds its event listeners. */
function qrSetupInit() {
  qrSetupEventsBind(); // Attach all QR setup click and keyboard handlers once.
}


export { qrSetupInit, qrSetupPanelClose, qrSetupPanelOpen, qrSetupResumeCancel, qrSetupResume, qrSetupScanCancel };
