import { qrSetupActionPanelClose } from "./action/panel/close.js";
import { qrSetupActionPanelOpen } from "./action/panel/open.js";
import { qrSetupActionScanStart } from "./action/scan/start.js";
import { qrSetupHandleCancel } from "./handle/cancel.js";
import { qrSetupStateGet } from "./state/get.js";

import { QR_SETUP_BACKDROP_SELECTOR } from "./qr-code-setup-const.js";
import { QR_SETUP_CLOSE_BTN_SELECTOR } from "./qr-code-setup-const.js";
import { QR_SETUP_OPEN_BTN_SELECTOR } from "./qr-code-setup-const.js";
import { QR_SETUP_PANEL_SELECTOR } from "./qr-code-setup-const.js";

/** Registers QR setup panel listeners and escape/backdrop handlers. */
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
        void qrSetupActionPanelClose();
        return;
      }

      void qrSetupActionScanStart();
    });
  });

  document
    .querySelector(QR_SETUP_CLOSE_BTN_SELECTOR)
    ?.addEventListener("click", (event) => {
      event.stopPropagation();
      void qrSetupActionPanelClose();
    });

  document
    .querySelector(QR_SETUP_BACKDROP_SELECTOR)
    ?.addEventListener("click", () => {
      void qrSetupActionPanelClose();
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
      void qrSetupActionPanelClose();
    },
    true,
  );
}

export { qrSetupInit };

export { qrSetupActionAdd } from "./action/add.js";
export { qrSetupActionInstant } from "./action/instant.js";
export { qrSetupActionLockClear } from "./action/lock/clear.js";
export { qrSetupActionLockSet } from "./action/lock/set.js";
export { qrSetupActionPanelClose } from "./action/panel/close.js";
export { qrSetupActionPanelOpen } from "./action/panel/open.js";
export { qrSetupActionScanCancel } from "./action/scan/cancel.js";
export { qrSetupActionScanError } from "./action/scan/error.js";
export { qrSetupActionScanStart } from "./action/scan/start.js";
export { qrSetupAnimationPanelClose } from "./animation/panel/close.js";
export { qrSetupAnimationPanelOpen } from "./animation/panel/open.js";
export { qrSetupAnimationResumeFinish } from "./animation/resume/finish.js";
export { qrSetupAnimationResumePrepare } from "./animation/resume/prepare.js";
export { qrSetupAnimationResumeReset } from "./animation/resume/reset.js";
export { qrSetupAnimationResumeStart } from "./animation/resume/start.js";
export { qrSetupHandleCancel } from "./handle/cancel.js";
export { qrSetupHandlePending } from "./handle/pending.js";
export { qrSetupHandleResume } from "./handle/resume.js";
export { qrSetupStateGet } from "./state/get.js";
export { qrSetupStateSet } from "./state/set.js";
export { qrSetupStateStore } from "./state/store.js";
