import { authStorageGet } from "../../../../../accounts/accounts-index.js";
import { qrSetupActionsPanelOpen } from "../panel/open.js";
import { qrSetupActionsScanError } from "./error.js";
import { qrSetupScanCancelGeneration } from "./cancel.js";
import { qrSetupStateGet } from "../../state/get.js";
import { qrSetupStateSet } from "../../state/set.js";
import { scanCancel } from "../../../../../scan/scan-index.js";
import { scanStart } from "../../../../../scan/scan-index.js";

import { UNSUPPORTED_PAGE_ERROR } from "../../../../../scan/scan-const.js";

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

export { qrSetupActionsScanStart };
