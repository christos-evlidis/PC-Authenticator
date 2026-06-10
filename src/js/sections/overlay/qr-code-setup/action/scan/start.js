import { authStorageGet } from "../../../../../accounts/accounts-index.js";
import { scanCancel } from "../../../../../scan/scan-index.js";
import { scanStart } from "../../../../../scan/scan-index.js";

import { qrSetupScanCancelGeneration } from "./cancel.js";
import { qrSetupActionScanError } from "./error.js";
import { qrSetupActionPanelOpen } from "../panel/open.js";
import { qrSetupStateGet } from "../../state/get.js";
import { qrSetupStateSet } from "../../state/set.js";

import { UNSUPPORTED_PAGE_ERROR } from "../../../../../scan/scan-const.js";

/** Verifies auth and starts QR page selection scan. */
async function qrSetupActionScanStart(options = {}) {
  const onScanError = options.onScanError ?? qrSetupActionScanError;

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

  await qrSetupActionPanelOpen();

  const startGeneration = qrSetupScanCancelGeneration;

  qrSetupStateSet({ isAwaitingPageSelection: true });

  const response = await scanStart();

  if (startGeneration !== qrSetupScanCancelGeneration) {
    await scanCancel();
    return;
  }

  if (!response?.success) {
    const errorMessage =
      response?.error || UNSUPPORTED_PAGE_ERROR;

    qrSetupStateSet({ isAwaitingPageSelection: false });

    if (onScanError) {
      await onScanError({ message: errorMessage, instantOpen: true });
    }
  }
}

export { qrSetupActionScanStart };
