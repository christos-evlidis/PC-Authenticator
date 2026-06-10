import { authStorageGet } from "../../../../../accounts/auth/storage/get.js";
import { qrSetupActionsPanelOpen } from "../panel/open.js";
import { qrSetupActionsScanError } from "./error.js";
import { qrSetupStateGet } from "../../state/get.js";
import { qrSetupStateSet } from "../../state/set.js";
import { scanStart } from "../../../../../scan/scan-index.js";

import { UNSUPPORTED_PAGE_ERROR } from "../../../../../scan/constants.js";

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

  const response = await scanStart();

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
