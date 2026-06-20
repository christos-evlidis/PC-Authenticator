import { qrSetupPanelClose } from "./action/qr-code-setup.panel.js";
import { qrSetupResumeCancel } from "./action/qr-code-setup.resume.js";
import { qrSetupScanStart } from "./action/qr-code-setup.scan.js";
import { qrSetupDomGet } from "./qr-code-setup.dom.js";
import { qrSetupStateGet } from "./qr-code-setup.state.js";

let _qrSetupEventsBound = false;

/** Binds all QR setup event listeners once. */
function _qrSetupEventsBind() {
  if (_qrSetupEventsBound) { // Stop when listeners are already attached.
    return; // Exit without binding duplicate handlers.
  }
  _qrSetupEventsBound = true; // Mark event binding as complete for this session.
  const dom = qrSetupDomGet(); // Read the current QR setup DOM references.
  chrome.runtime.onMessage.addListener((message) => { // Listen for scan cancellation messages from the extension runtime.
    if (message.action === "qrScanCancelled") { // Handle explicit scan cancel events from the content script.
      qrSetupResumeCancel(); // Stop any active scan or resume animation.
      if (qrSetupStateGet().statePanel) { // Close the panel when it is still open after a page-side cancel.
        void qrSetupPanelClose(); // Run the normal panel close flow without reopening the popup.
      }
    }
  });
  dom.openBtns?.forEach((button) => { // Attach handlers to every header scan button.
    button.addEventListener("click", (event) => { // Toggle scan or close when a scan button is clicked.
      event.preventDefault(); // Prevent any default button behavior.
      event.stopPropagation(); // Stop the click from bubbling to parent handlers.
      if (qrSetupStateGet().statePanel) { // Use the close flow when the panel is currently open.
        void qrSetupPanelClose(); // Close the panel when the active scan button is clicked again.
        return; // Exit after handling the close action.
      }
      void qrSetupScanStart(); // Start a new scan when the panel is currently closed.
    });
  });
  dom.closeBtn?.addEventListener("click", (event) => { // Handle close button clicks.
    event.stopPropagation(); // Stop the click from bubbling to the panel handler.
    void qrSetupPanelClose(); // Close the panel when the close button is clicked.
  });
  dom.backdrop?.addEventListener("click", () => { // Handle backdrop clicks.
    void qrSetupPanelClose(); // Close the panel when the backdrop is clicked.
  });
  dom.panel?.addEventListener("click", (event) => { // Keep panel clicks from reaching the backdrop handler.
    event.stopPropagation(); // Stop panel clicks from bubbling to the backdrop.
  });
  document.addEventListener("keydown", (event) => { // Handle Escape key presses for open panels.
    if (event.key !== "Escape") { // Ignore every key except Escape.
      return; // Exit without closing the panel.
    }
    if (!qrSetupStateGet().statePanel) { // Ignore Escape when the panel is already closed.
      return; // Exit without closing the panel.
    }
    event.preventDefault(); // Prevent the browser from handling Escape elsewhere.
    event.stopPropagation(); // Stop Escape from bubbling to other capture listeners.
    void qrSetupPanelClose(); // Close the panel when Escape is pressed.
  }, { capture: true }); // Listen during capture so Escape is handled before other overlays.
}


export { _qrSetupEventsBind as qrSetupEventsBind };
