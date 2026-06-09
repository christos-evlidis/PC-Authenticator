import { qrSetupPanelClose } from "./actions/close.js";
import { qrSetupPanelOpen } from "./actions/open.js";
import { cancelPageSelection } from "./qr-code-setup-scan.js";
import { createQrSetupKeyDownHandler } from "./qr-code-setup-scan.js";
import { handleQrScanCancelled } from "./qr-code-setup-scan.js";
import { processPendingQrScan } from "./qr-code-setup-scan.js";
import { startQrScan } from "./qr-code-setup-scan.js";
import { showScanError } from "./qr-code-setup-add.js";
import { qrSetupStateGet } from "./state.js";

import { QR_SETUP_ACTIVE_CLASS } from "./constants.js";
import { QR_SETUP_BACKDROP_SELECTOR } from "./constants.js";
import { QR_SETUP_CLOSE_BTN_SELECTOR } from "./constants.js";
import { QR_SETUP_OPEN_BTN_SELECTOR } from "./constants.js";
import { QR_SETUP_PANEL_SELECTOR } from "./constants.js";
import { QR_SETUP_ROOT_SELECTOR } from "./constants.js";

function startQrScanBound() {
  return startQrScan({ onScanError: showScanError });
}

function processPendingQrScanBound(options = {}) {
  return processPendingQrScan({
    ...options,
    onScanError: showScanError,
  });
}

function closeQrSetupBound() {
  return qrSetupPanelClose(cancelPageSelection);
}

/** Returns whether the QR setup overlay is currently open. */
function qrSetupIsActive() {
  return (
    qrSetupStateGet().isOpen
    || (document.querySelector(QR_SETUP_ROOT_SELECTOR)?.classList.contains(QR_SETUP_ACTIVE_CLASS)
      ?? false)
  );
}

/** Returns whether QR setup is busy or awaiting a page selection. */
function qrSetupIsRunning() {
  const state = qrSetupStateGet();
  return state.isBusy || state.isAwaitingPageSelection;
}

/** Registers QR setup listeners. */
function qrSetupInit() {
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "qrScanCancelled") {
      handleQrScanCancelled();
    }
  });

  document.querySelectorAll(QR_SETUP_OPEN_BTN_SELECTOR).forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (qrSetupIsActive()) {
        void closeQrSetupBound();
        return;
      }

      void startQrScanBound();
    });
  });

  document
    .querySelector(QR_SETUP_CLOSE_BTN_SELECTOR)
    ?.addEventListener("click", (event) => {
      event.stopPropagation();
      void closeQrSetupBound();
    });

  document
    .querySelector(QR_SETUP_BACKDROP_SELECTOR)
    ?.addEventListener("click", () => {
      void closeQrSetupBound();
    });

  document
    .querySelector(QR_SETUP_PANEL_SELECTOR)
    ?.addEventListener("click", (event) => {
      event.stopPropagation();
    });

  document.addEventListener("keydown", createQrSetupKeyDownHandler(closeQrSetupBound), true);
}

export const qrCodeSetupSection = {
  init: qrSetupInit,
  open: qrSetupPanelOpen,
  close: closeQrSetupBound,
  workerStartScan: startQrScanBound,
  processPendingScan: processPendingQrScanBound,
  isActive: qrSetupIsActive,
  isRunning: qrSetupIsRunning,
};
