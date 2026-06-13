import { qrSetupEventsBind } from "./qr-code-setup.events.js";


// Initializes the QR code setup module and binds events.
function qrSetupInit() {
  qrSetupEventsBind();
}


export { qrSetupInit };
export { qrSetupPanelOpen, qrSetupPanelClose } from "./action/qr-code-setup.panel.js";
export { qrSetupScanCancel } from "./action/qr-code-setup.scan.js";
export { qrSetupResumeCancel, qrSetupResumePerform, qrSetupResumeCheck } from "./action/qr-code-setup.resume.js";
