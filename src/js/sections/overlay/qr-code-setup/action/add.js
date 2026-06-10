import { authStorageGet } from "../../../../accounts/accounts-index.js";
import { dataActionAddQr } from "../../../../accounts/accounts-index.js";
import { scanStart } from "../../../../scan/scan-index.js";

import { qrSetupActionInstant } from "./instant.js";
import { qrSetupActionLockSet } from "./lock/set.js";
import { qrSetupActionPanelOpen } from "./panel/open.js";
import { qrSetupStateGet } from "../state/get.js";
import { qrSetupStateSet } from "../state/set.js";

import { QR_SETUP_BUSY_CLASS } from "../qr-code-setup-const.js";
import { QR_SETUP_ROOT_SELECTOR } from "../qr-code-setup-const.js";

/** Opens QR setup and starts page scan to add an account. */
async function qrSetupActionAdd(otpauthUri, options = {}) {
  const { instantOpen = false } = options;

  if (qrSetupStateGet().isBusy) {
    throw new Error("QR add is already running.");
  }

  const authNumber = await authStorageGet();

  if (!authNumber) {
    throw new Error("Sign in to add accounts.");
  }

  qrSetupStateSet({ isBusy: true });
  qrSetupActionLockSet(true);
  document.querySelector(QR_SETUP_ROOT_SELECTOR)?.classList.add(QR_SETUP_BUSY_CLASS);

  try {
    if (instantOpen) {
      qrSetupActionInstant();
    } else {
      await qrSetupActionPanelOpen();
    }

    await dataActionAddQr(authNumber, otpauthUri);

    qrSetupStateSet({ isAwaitingPageSelection: true });

    const response = await scanStart();

    if (!response?.success) {
      qrSetupStateSet({ isAwaitingPageSelection: false });
    }
  } finally {
    qrSetupStateSet({ isBusy: false });
    qrSetupActionLockSet(false);
    document.querySelector(QR_SETUP_ROOT_SELECTOR)?.classList.remove(QR_SETUP_BUSY_CLASS);
  }
}

export { qrSetupActionAdd };
