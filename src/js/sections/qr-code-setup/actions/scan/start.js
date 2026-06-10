import { authStorageGet } from "../../../../accounts/accounts-index.js";
import { UNSUPPORTED_PAGE_ERROR, scanStart } from "../../../../scan/scan-index.js";
import { qrSetupActionsPanelOpen } from "../panel/open.js";
import { qrSetupActionsScanError } from "./error.js";
import { QR_SETUP_GUIDE_SELECTION_TEXT } from "../../constants.js";
import { QR_SETUP_GUIDE_TEXT_SELECTOR } from "../../constants.js";
import { qrSetupStateGet } from "../../state/get.js";
import { qrSetupStateSet } from "../../state/set.js";

/** Starts QR scan flow: opens panel and begins page selection. */
async function qrSetupActionsScanStart(options = {}) {
  const onScanError = options.onScanError ?? qrSetupActionsScanError;

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

  await qrSetupActionsPanelOpen();

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

    if (onScanError) {
      await onScanError({ message: errorMessage, instantOpen: true });
    }
  }
}

export { qrSetupActionsScanStart };
