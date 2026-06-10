import { dataActionAddQr, authStorageGet } from "../../../accounts/accounts-index.js";
import { UNSUPPORTED_PAGE_ERROR, scanStart } from "../../../scan/scan-index.js";
import { qrSetupActionsLockSet } from "./lock/set.js";
import { qrSetupActionsPanelOpen } from "./panel/open.js";
import { qrSetupActionsInstant } from "./instant.js";
import { QR_SETUP_BUSY_CLASS } from "../constants.js";
import { QR_SETUP_GUIDE_SELECTION_TEXT } from "../constants.js";
import { QR_SETUP_GUIDE_TEXT_SELECTOR } from "../constants.js";
import { QR_SETUP_ROOT_SELECTOR } from "../constants.js";
import { qrSetupStateGet } from "../state/get.js";
import { qrSetupStateSet } from "../state/set.js";

/** Adds an account from a scanned URI and resumes page selection. */
async function qrSetupActionsAdd(otpauthUri, options = {}) {
  const { instantOpen = false } = options;

  if (qrSetupStateGet().isBusy) {
    throw new Error("QR add is already running.");
  }

  const authNumber = await authStorageGet();

  if (!authNumber) {
    throw new Error("Sign in to add accounts.");
  }

  qrSetupStateSet({ isBusy: true });
  qrSetupActionsLockSet(true);
  document.querySelector(QR_SETUP_ROOT_SELECTOR)?.classList.add(QR_SETUP_BUSY_CLASS);

  try {
    if (instantOpen) {
      qrSetupActionsInstant();
    } else {
      await qrSetupActionsPanelOpen();
    }

    await dataActionAddQr(authNumber, otpauthUri);

    qrSetupStateSet({ isAwaitingPageSelection: true });

    const guideText = document.querySelector(QR_SETUP_GUIDE_TEXT_SELECTOR);

    if (guideText) {
      guideText.textContent = QR_SETUP_GUIDE_SELECTION_TEXT;
      guideText.classList.remove("is-hidden");
    }

    const response = await scanStart();

    if (!response?.success) {
      const errorMessage =
        response?.error || UNSUPPORTED_PAGE_ERROR;

      qrSetupStateSet({ isAwaitingPageSelection: false });

      if (guideText) {
        guideText.textContent = errorMessage;
        guideText.classList.remove("is-hidden");
      }
    }
  } finally {
    qrSetupStateSet({ isBusy: false });
    qrSetupActionsLockSet(false);
    document.querySelector(QR_SETUP_ROOT_SELECTOR)?.classList.remove(QR_SETUP_BUSY_CLASS);
  }
}

export { qrSetupActionsAdd };
