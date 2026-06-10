import { qrSetupActionsPanelClose } from "./action/panel/close.js";
import { qrSetupActionsPanelOpen } from "./action/panel/open.js";
import { qrSetupActionsScanStart } from "./action/scan/start.js";
import { qrSetupHandleCancel } from "./handle/cancel.js";
import { qrSetupStateGet } from "./state/get.js";

import { QR_SETUP_BACKDROP_SELECTOR } from "./qr-code-setup-const.js";
import { QR_SETUP_CLOSE_BTN_SELECTOR } from "./qr-code-setup-const.js";
import { QR_SETUP_OPEN_BTN_SELECTOR } from "./qr-code-setup-const.js";
import { QR_SETUP_PANEL_SELECTOR } from "./qr-code-setup-const.js";

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

export { qrSetupActionsAdd } from "./action/add.js";
export { qrSetupActionsInstant } from "./action/instant.js";
export { qrSetupActionsLockClear } from "./action/lock/clear.js";
export { qrSetupActionsLockSet } from "./action/lock/set.js";
export { qrSetupActionsPanelClose } from "./action/panel/close.js";
export { qrSetupActionsPanelOpen } from "./action/panel/open.js";
export { qrSetupActionsScanCancel } from "./action/scan/cancel.js";
export { qrSetupActionsScanError } from "./action/scan/error.js";
export { qrSetupActionsScanStart } from "./action/scan/start.js";
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
