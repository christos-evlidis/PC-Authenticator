import { qrSetupActionsPanelClose } from "./actions/panel/close.js";
import { qrSetupActionsPanelOpen } from "./actions/panel/open.js";
import { qrSetupHandleCancel } from "./handle/cancel.js";
import { qrSetupActionsScanStart } from "./actions/scan/start.js";
import { qrSetupStateGet } from "./state/get.js";

import { QR_SETUP_BACKDROP_SELECTOR } from "./constants.js";
import { QR_SETUP_CLOSE_BTN_SELECTOR } from "./constants.js";
import { QR_SETUP_OPEN_BTN_SELECTOR } from "./constants.js";
import { QR_SETUP_PANEL_SELECTOR } from "./constants.js";

/** Registers QR setup listeners. */
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

export { qrSetupActionsPanelClose } from "./actions/panel/close.js";
export { qrSetupActionsPanelOpen } from "./actions/panel/open.js";
export { qrSetupActionsInstant } from "./actions/instant.js";
export { qrSetupActionsLockClear } from "./actions/lock/clear.js";
export { qrSetupActionsLockSet } from "./actions/lock/set.js";
export { qrSetupActionsScanCancel } from "./actions/scan/cancel.js";
export { qrSetupActionsScanError } from "./actions/scan/error.js";
export { qrSetupActionsScanStart } from "./actions/scan/start.js";
export { qrSetupAnimationClose } from "./animation/close.js";
export { qrSetupAnimationOpen } from "./animation/open.js";
export { qrSetupActionsAdd } from "./actions/add.js";
export { qrSetupHandleCancel } from "./handle/cancel.js";
export { qrSetupHandlePending } from "./handle/pending.js";
export { qrSetupHandleResume } from "./handle/resume.js";
export { qrSetupInit };
