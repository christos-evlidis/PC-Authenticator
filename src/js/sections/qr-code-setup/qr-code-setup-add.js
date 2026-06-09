import { authStorageGet } from "../../accounts/accounts-index.js";
import { qrSetupPanelOpen } from "./actions/open.js";
import { qrSetupPanelOpenInstant } from "./actions/open.js";
import { BODY_AUTH_FLOW_LOCK_CLASS } from "./constants.js";
import { QR_SETUP_BUSY_CLASS } from "./constants.js";
import { QR_SETUP_ROOT_SELECTOR } from "./constants.js";
import { qrSetupGuideReset } from "./guide.js";
import { qrSetupGuideSetCopyVisible } from "./guide.js";
import { qrSetupGuideSetText } from "./guide.js";
import { qrSetupStateGet } from "./state.js";
import { qrSetupStateSet } from "./state.js";
import { createQrAddPromise } from "./qr-code-setup-scan.js";
import { resumePageQrScan } from "./qr-code-setup-scan.js";

function qrSetupAuthFlowLockSet(isLocked) {
  document.body.classList.toggle(BODY_AUTH_FLOW_LOCK_CLASS, isLocked);
}

/** Adds an account from a scanned URI and resumes page selection. */
async function playQrAddFromUri(otpauthUri, options = {}) {
  const { instantOpen = false } = options;

  if (qrSetupStateGet().isBusy) {
    throw new Error("QR add is already running.");
  }

  const authNumber = await authStorageGet();

  if (!authNumber) {
    throw new Error("Sign in to add accounts.");
  }

  qrSetupStateSet({ isBusy: true });
  qrSetupAuthFlowLockSet(true);
  document.querySelector(QR_SETUP_ROOT_SELECTOR)?.classList.add(QR_SETUP_BUSY_CLASS);

  try {
    if (instantOpen) {
      qrSetupPanelOpenInstant();
    } else {
      await qrSetupPanelOpen();
    }

    await createQrAddPromise(authNumber, otpauthUri);
    qrSetupGuideReset();
    await resumePageQrScan();
  } finally {
    qrSetupStateSet({ isBusy: false });
    qrSetupAuthFlowLockSet(false);
    document.querySelector(QR_SETUP_ROOT_SELECTOR)?.classList.remove(QR_SETUP_BUSY_CLASS);
  }
}

/** Opens QR setup and shows a scan/add error message. */
async function showScanError(options = {}) {
  const { instantOpen = false, message } = options;

  if (instantOpen) {
    qrSetupPanelOpenInstant();
  } else {
    await qrSetupPanelOpen();
  }

  qrSetupGuideSetText(
    message || "Could not add this account. Tap the QR button to try again.",
  );
  qrSetupGuideSetCopyVisible(true);
}

export { playQrAddFromUri };
export { showScanError };
