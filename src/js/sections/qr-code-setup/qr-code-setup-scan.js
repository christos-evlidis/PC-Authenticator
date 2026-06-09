import { dataActionAddQr } from "../../accounts/accounts-index.js";
import { authStorageGet } from "../../accounts/accounts-index.js";
import {
  UNSUPPORTED_PAGE_ERROR,
  scanCancel,
  scanPendingClear,
  scanPendingGet,
  scanStart,
} from "../../scan/scan-index.js";
import { clearPopupResumeState } from "../../popup-resume/popup-resume.js";
import { getPopupResumePending } from "../../popup-resume/popup-resume.js";
import { playQrAddFromUri } from "./qr-code-setup-add.js";
import { showScanError } from "./qr-code-setup-add.js";
import { qrSetupPanelOpen } from "./actions/open.js";
import { BODY_AUTH_FLOW_LOCK_CLASS } from "./constants.js";
import { qrSetupGuideReset } from "./guide.js";
import { qrSetupGuideSetCopyVisible } from "./guide.js";
import { qrSetupGuideSetText } from "./guide.js";
import { qrSetupStateGet } from "./state.js";
import { qrSetupStateSet } from "./state.js";

import { QR_SETUP_ACTIVE_CLASS } from "./constants.js";
import { QR_SETUP_ROOT_SELECTOR } from "./constants.js";

function qrSetupIsActive() {
  return (
    qrSetupStateGet().isOpen
    || (document.querySelector(QR_SETUP_ROOT_SELECTOR)?.classList.contains(QR_SETUP_ACTIVE_CLASS)
      ?? false)
  );
}

function qrSetupAuthFlowLockSet(isLocked) {
  document.body.classList.toggle(BODY_AUTH_FLOW_LOCK_CLASS, isLocked);
}

function resetQrSetupAfterStartError(errorMessage) {
  qrSetupStateSet({ isAwaitingPageSelection: false });
  qrSetupAuthFlowLockSet(false);
  qrSetupGuideReset();
  qrSetupGuideSetText(errorMessage);
  qrSetupGuideSetCopyVisible(true);
}

/** Creates the promise that adds an account from a scanned otpauth URI. */
async function createQrAddPromise(authNumber, otpauthUri) {
  return dataActionAddQr(authNumber, otpauthUri);
}

/** Cancels an in-progress page QR selection when applicable. */
async function cancelPageSelection() {
  if (!qrSetupStateGet().isAwaitingPageSelection) {
    return;
  }

  qrSetupStateSet({ isAwaitingPageSelection: false });
  await scanCancel();
}

async function startPageQrOverlay(options = {}) {
  const { onScanError } = options;

  qrSetupStateSet({ isAwaitingPageSelection: true });
  qrSetupGuideReset();

  const response = await scanStart();

  if (!response?.success) {
    const errorMessage =
      response?.error || UNSUPPORTED_PAGE_ERROR;

    qrSetupStateSet({ isAwaitingPageSelection: false });
    qrSetupGuideSetText(errorMessage);
    qrSetupGuideSetCopyVisible(true);

    if (onScanError) {
      await onScanError({ message: errorMessage, instantOpen: true });
    }

    return false;
  }

  return true;
}

/** Resumes page QR selection after a successful add. */
async function resumePageQrScan(options = {}) {
  if (qrSetupStateGet().isBusy) {
    return;
  }

  return startPageQrOverlay(options);
}

/** Starts QR scan flow: opens panel and begins page selection. */
async function startQrScan(options = {}) {
  const { onScanError } = options;

  if (qrSetupStateGet().isBusy) {
    return;
  }

  const authNumber = await authStorageGet();

  if (!authNumber) {
    if (onScanError) {
      await onScanError();
    }
    return;
  }

  await qrSetupPanelOpen();
  await startPageQrOverlay({ onScanError });
}

/** Handles a cancelled QR scan message from the extension runtime. */
function handleQrScanCancelled() {
  qrSetupStateSet({ isAwaitingPageSelection: false });
  qrSetupGuideSetText("Scan cancelled. Tap the QR button to try again.");
}

/** Creates the Escape key handler for closing QR setup. */
function createQrSetupKeyDownHandler(closeQrSetupBound) {
  return function handleQrSetupKeyDown(event) {
    if (event.key !== "Escape") {
      return;
    }

    if (!qrSetupIsActive()) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    void closeQrSetupBound();
  };
}

/** Processes a pending QR scan saved before the popup opened. */
async function processPendingQrScan(options = {}) {
  const { instantOpen = false, onScanError } = options;

  if (qrSetupStateGet().isBusy) {
    return;
  }

  const pending = getPopupResumePending() || (await scanPendingGet());

  if (!pending) {
    return;
  }

  await scanPendingClear();
  clearPopupResumeState();
  qrSetupStateSet({ isAwaitingPageSelection: false });

  if (pending.status === "ready" && pending.uri) {
    await playQrAddFromUri(pending.uri, { instantOpen });
    return;
  }

  if (pending.status === "error") {
    const errorMessage =
      pending.message || UNSUPPORTED_PAGE_ERROR;

    if (onScanError) {
      await onScanError({ instantOpen, message: errorMessage });
    } else {
      resetQrSetupAfterStartError(errorMessage);
    }
  }
}

export { cancelPageSelection };
export { createQrAddPromise };
export { createQrSetupKeyDownHandler };
export { handleQrScanCancelled };
export { processPendingQrScan };
export { resumePageQrScan };
export { startQrScan };
