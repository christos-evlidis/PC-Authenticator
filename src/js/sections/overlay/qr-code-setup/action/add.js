import { authStorageGet } from "../../../../accounts/auth/storage/get.js";
import { dataActionAddQr } from "../../../../accounts/data/action/add/qr.js";
import { qrSetupActionsInstant } from "./instant.js";
import { qrSetupActionsLockSet } from "./lock/set.js";
import { qrSetupActionsPanelOpen } from "./panel/open.js";
import { qrSetupStateGet } from "../state/get.js";
import { qrSetupStateSet } from "../state/set.js";
import { scanStart } from "../../../../scan/scan-index.js";

import { QR_SETUP_BUSY_CLASS } from "../constants.js";
import { QR_SETUP_ROOT_SELECTOR } from "../constants.js";

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

    const response = await scanStart();

    if (!response?.success) {
      qrSetupStateSet({ isAwaitingPageSelection: false });
    }
  } finally {
    qrSetupStateSet({ isBusy: false });
    qrSetupActionsLockSet(false);
    document.querySelector(QR_SETUP_ROOT_SELECTOR)?.classList.remove(QR_SETUP_BUSY_CLASS);
  }
}

export { qrSetupActionsAdd };
