import { qrSetupPanelClose, qrSetupPanelOpen } from "./action/qr-code-setup.panel.js";
import { qrSetupResumeCancel, qrSetupResume } from "./action/qr-code-setup.resume.js";
import { qrSetupScanCancel } from "./action/qr-code-setup.scan.js";
import { qrSetupEventsBind } from "./qr-code-setup.events.js";


function _qrSetupInit() {
  qrSetupEventsBind();
}

export {
  _qrSetupInit as qrSetupInit,
  qrSetupPanelClose,
  qrSetupPanelOpen,
  qrSetupResumeCancel,
  qrSetupResume,
  qrSetupScanCancel,
};

// Functions exported from this section:
// - qrSetupInit
// - qrSetupPanelClose
// - qrSetupPanelOpen
// - qrSetupResumeCancel
// - qrSetupResume
// - qrSetupScanCancel

// Functions used by other parts of the codebase:
// - qrSetupInit (used in project/src/js/sections/sections-index.js)
// - qrSetupResume (used in project/src/js/app/app.scan.js)
