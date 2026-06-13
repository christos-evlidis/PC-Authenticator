import { qrSetupDomGet } from "./qr-code-setup.dom.js";
import { qrSetupStateGet } from "./qr-code-setup.state.js";
import { qrSetupPanelClose } from "./action/qr-code-setup.panel.js";
import { qrSetupScanStart } from "./action/qr-code-setup.scan.js";
import { qrSetupResumeCancel } from "./action/qr-code-setup.resume.js";


let qrSetupEventsBound = false;

// Binds all DOM event listeners for the QR setup panel.
function qrSetupEventsBind() {
  if (qrSetupEventsBound) {
    return;
  }

  qrSetupEventsBound = true;

  const dom = qrSetupDomGet();

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "qrScanCancelled") {
      qrSetupResumeCancel();
    }
  });

  dom.openBtns?.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      event.stopPropagation();

      if (qrSetupStateGet().statePanel) {
        void qrSetupPanelClose();

        return;
      }

      void qrSetupScanStart();
    });
  });

  dom.closeBtn?.addEventListener("click", (event) => {
    event.stopPropagation();

    void qrSetupPanelClose();
  });

  dom.backdrop?.addEventListener("click", () => {
    void qrSetupPanelClose();
  });

  dom.panel?.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {

      return;
    }

    if (!qrSetupStateGet().statePanel) {

      return;
    }

    event.preventDefault();

    event.stopPropagation();
    
    void qrSetupPanelClose();
  }, { capture: true });
}


export { qrSetupEventsBind };
