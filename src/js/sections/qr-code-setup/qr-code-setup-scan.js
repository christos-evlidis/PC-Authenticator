import { dataAddQr } from "../../accounts/accounts-index.js";
import { getVerifiedAuthNumber } from "../../utils/utility-auth.js";
import {
  QR_SCAN_UNSUPPORTED_PAGE_ERROR,
  qrScanCancel,
  qrScanPendingClear,
  qrScanPendingGet,
  qrScanStart,
} from "../../scan/scan-index.js";
import { clearPopupResumeState } from "../../popup-resume/popup-resume.js";
import { getPopupResumePending } from "../../popup-resume/popup-resume.js";
import { playQrAddFromUri } from "./qr-code-setup-add.js";
import { showScanError } from "./qr-code-setup-add.js";
import {
  getIsAwaitingPageSelection,
  getIsQrBusy,
  isQrSetupActive,
  openQrSetup,
  resetQrSetupGuide,
  setAuthFlowLock,
  setGuideCopyVisible,
  setGuideText,
  setIsAwaitingPageSelection,
} from "./qr-code-setup-panel.js";

function resetQrSetupAfterStartError(errorMessage) {
  setIsAwaitingPageSelection(false);
  setAuthFlowLock(false);
  resetQrSetupGuide();
  setGuideText(errorMessage);
  setGuideCopyVisible(true);
}

export async function createQrAddPromise(authNumber, otpauthUri) {
  return dataAddQr(authNumber, otpauthUri);
}

export async function cancelPageSelection() {
  if (!getIsAwaitingPageSelection()) {
    return;
  }

  setIsAwaitingPageSelection(false);
  await qrScanCancel();
}

async function startPageQrOverlay(options = {}) {
  const { onScanError } = options;

  setIsAwaitingPageSelection(true);
  resetQrSetupGuide();

  const response = await qrScanStart();

  if (!response?.success) {
    const errorMessage =
      response?.error || QR_SCAN_UNSUPPORTED_PAGE_ERROR;

    setIsAwaitingPageSelection(false);
    setGuideText(errorMessage);
    setGuideCopyVisible(true);

    if (onScanError) {
      await onScanError({ message: errorMessage, instantOpen: true });
    }

    return false;
  }

  return true;
}

export async function resumePageQrScan(options = {}) {
  if (getIsQrBusy()) {
    return;
  }

  return startPageQrOverlay(options);
}

export async function startQrScan(options = {}) {
  const { onScanError } = options;

  if (getIsQrBusy()) {
    return;
  }

  const authNumber = await getVerifiedAuthNumber();

  if (!authNumber) {
    if (onScanError) {
      await onScanError();
    }
    return;
  }

  await openQrSetup();
  await startPageQrOverlay({ onScanError });
}

export function handleQrScanCancelled() {
  setIsAwaitingPageSelection(false);
  setGuideText("Scan cancelled. Tap the QR button to try again.");
}

export function createQrSetupKeyDownHandler(closeQrSetupBound) {
  return function handleQrSetupKeyDown(event) {
    if (event.key !== "Escape") {
      return;
    }

    if (!isQrSetupActive()) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    void closeQrSetupBound();
  };
}

export async function processPendingQrScan(options = {}) {
  const { instantOpen = false, onScanError } = options;

  if (getIsQrBusy()) {
    return;
  }

  const pending = getPopupResumePending() || (await qrScanPendingGet());

  if (!pending) {
    return;
  }

  await qrScanPendingClear();
  clearPopupResumeState();
  setIsAwaitingPageSelection(false);

  if (pending.status === "ready" && pending.uri) {
    await playQrAddFromUri(pending.uri, { instantOpen });
    return;
  }

  if (pending.status === "error") {
    const errorMessage =
      pending.message || QR_SCAN_UNSUPPORTED_PAGE_ERROR;

    if (onScanError) {
      await onScanError({ instantOpen, message: errorMessage });
    } else {
      resetQrSetupAfterStartError(errorMessage);
    }
  }
}
