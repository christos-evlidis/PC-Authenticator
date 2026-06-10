import { UNSUPPORTED_PAGE_ERROR, scanPendingClear, scanPendingGet } from "../../../scan/scan-index.js";
import { qrSetupActionsLockSet } from "../actions/lock/set.js";
import { QR_SETUP_GUIDE_TEXT_SELECTOR } from "../constants.js";
import { qrSetupStateGet } from "../state/get.js";
import { qrSetupStateSet } from "../state/set.js";
import { qrSetupActionsAdd } from "../actions/add.js";
import { qrSetupActionsScanError } from "../actions/scan/error.js";

/** Processes a pending QR scan saved before the popup opened. */
async function qrSetupHandlePending(options = {}) {
  const { instantOpen = false } = options;
  const onScanError = options.onScanError ?? qrSetupActionsScanError;

  if (qrSetupStateGet().isBusy) {
    return;
  }

  const pending = await scanPendingGet();

  if (!pending) {
    return;
  }

  await scanPendingClear();
  qrSetupStateSet({ isAwaitingPageSelection: false });

  if (pending.status === "ready" && pending.uri) {
    await qrSetupActionsAdd(pending.uri, { instantOpen });
    return;
  }

  if (pending.status === "error") {
    const errorMessage =
      pending.message || UNSUPPORTED_PAGE_ERROR;

    if (onScanError) {
      await onScanError({ instantOpen, message: errorMessage });
    } else {
      qrSetupStateSet({ isAwaitingPageSelection: false });
      qrSetupActionsLockSet(false);

      const guideText = document.querySelector(QR_SETUP_GUIDE_TEXT_SELECTOR);

      if (guideText) {
        guideText.textContent = errorMessage;
        guideText.classList.remove("is-hidden");
      }
    }
  }
}

export { qrSetupHandlePending };
