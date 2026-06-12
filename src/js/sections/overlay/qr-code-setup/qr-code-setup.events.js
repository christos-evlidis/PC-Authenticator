import { qrSetupDomGet } from "./qr-code-setup.dom.js";
import { qrSetupStateGet } from "./qr-code-setup.state.js";
import { qrSetupPanelClose } from "./qr-code-setup.panel.js";
import { qrSetupScanStart } from "./qr-code-setup.scan.js";
import { qrSetupResumeCancel } from "./qr-code-setup.resume.js";

let qrSetupEventsAbortController = null;

// Binds all DOM event listeners for the QR setup panel.
function qrSetupEventsBind() {
  if (qrSetupEventsAbortController) {
    return;
  }

  qrSetupEventsAbortController = new AbortController();
  const { signal } = qrSetupEventsAbortController;
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
    }, { signal });
  });

  dom.closeBtn?.addEventListener("click", (event) => {
    event.stopPropagation();
    void qrSetupPanelClose();
  }, { signal });

  dom.backdrop?.addEventListener("click", () => {
    void qrSetupPanelClose();
  }, { signal });

  dom.panel?.addEventListener("click", (event) => {
    event.stopPropagation();
  }, { signal });

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
  }, { signal, capture: true });
}

// Drops all bound DOM event listeners for the QR setup panel.
function qrSetupEventsDrop() {
  if (qrSetupEventsAbortController) {
    qrSetupEventsAbortController.abort();
    qrSetupEventsAbortController = null;
  }
}

export { qrSetupEventsBind, qrSetupEventsDrop };
