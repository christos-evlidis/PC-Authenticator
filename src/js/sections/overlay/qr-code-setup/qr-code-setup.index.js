import { qrSetupDomGet } from "./qr-code-setup.dom.js";
import { qrSetupEventsBind } from "./qr-code-setup.events.js";

function qrSetupInit() {
  qrSetupDomGet();
  qrSetupEventsBind();
}

export { qrSetupInit };
export { qrSetupPanelOpen, qrSetupPanelClose, qrSetupPanelInstant } from "./qr-code-setup.panel.js";
export { qrSetupScanCancel } from "./qr-code-setup.scan.js";
export { qrSetupResumeCancel, qrSetupResumePerform } from "./qr-code-setup.resume.js";
