import { qrSetupActionsPanelClose } from "./action/panel/close.js";
import { qrSetupActionsPanelOpen } from "./action/panel/open.js";
import { qrSetupActionsScanStart } from "./action/scan/start.js";
import { qrSetupHandleCancel } from "./handle/cancel.js";
import { qrSetupStateGet } from "./state/get.js";

import { QR_SETUP_BACKDROP_SELECTOR } from "./constants.js";
import { QR_SETUP_CLOSE_BTN_SELECTOR } from "./constants.js";
import { QR_SETUP_OPEN_BTN_SELECTOR } from "./constants.js";
import { QR_SETUP_PANEL_SELECTOR } from "./constants.js";

function qrSetupInit() {
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "qrScanCancelled") {
      qrSetupHandleCancel();
    }
  });

  document.querySelectorAll(QR_SETUP_OPEN_BTN_SELECTOR).forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (qrSetupStateGet().isOpen) {
        void qrSetupActionsPanelClose();
        return;
      }

      void qrSetupActionsScanStart();
    });
  });

  document
    .querySelector(QR_SETUP_CLOSE_BTN_SELECTOR)
    ?.addEventListener("click", (event) => {
      event.stopPropagation();
      void qrSetupActionsPanelClose();
    });

  document
    .querySelector(QR_SETUP_BACKDROP_SELECTOR)
    ?.addEventListener("click", () => {
      void qrSetupActionsPanelClose();
    });

  document
    .querySelector(QR_SETUP_PANEL_SELECTOR)
    ?.addEventListener("click", (event) => {
      event.stopPropagation();
    });

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key !== "Escape") {
        return;
      }

      if (!qrSetupStateGet().isOpen) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      void qrSetupActionsPanelClose();
    },
    true,
  );
}

export { qrSetupInit };
