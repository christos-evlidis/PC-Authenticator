import { cross } from "../section-cross.js";
import { createQrAddPromise } from "./qr-code-setup-scan.js";
import { resumePageQrScan } from "./qr-code-setup-scan.js";
import {
  getIsQrBusy,
  openQrSetup,
  openQrSetupInstant,
  resetQrSetupGuide,
  setAuthFlowLock,
  setGuideCopyVisible,
  setGuideText,
  setIsQrBusy,
} from "./qr-code-setup-panel.js";

export async function playQrAddFromUri(otpauthUri, options = {}) {
  const { instantOpen = false } = options;

  if (getIsQrBusy()) {
    throw new Error("QR add is already running.");
  }

  const { accountNumber } = await chrome.storage.local.get(["accountNumber"]);

  if (!accountNumber) {
    throw new Error("Sign in to add accounts.");
  }

  setIsQrBusy(true);
  setAuthFlowLock(true);

  try {
    if (instantOpen) {
      openQrSetupInstant();
    } else {
      await openQrSetup();
    }

    const addedAccount = await createQrAddPromise(accountNumber, otpauthUri);
    await cross.codes.animateManualAccountAdd(addedAccount);
    resetQrSetupGuide();
    await resumePageQrScan();
    return addedAccount;
  } finally {
    setIsQrBusy(false);
    setAuthFlowLock(false);
  }
}

export async function showScanError(options = {}) {
  const { instantOpen = false, message } = options;

  if (instantOpen) {
    openQrSetupInstant();
  } else {
    await openQrSetup();
  }

  setGuideText(
    message || "Could not add this account. Tap the QR button to try again.",
  );
  setGuideCopyVisible(true);
}
