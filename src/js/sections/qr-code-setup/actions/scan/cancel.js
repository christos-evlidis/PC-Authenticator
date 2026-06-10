import { scanCancel } from "../../../../scan/scan-index.js";
import { qrSetupStateGet } from "../../state/get.js";
import { qrSetupStateSet } from "../../state/set.js";

/** Cancels an in-progress page QR selection when applicable. */
async function qrSetupActionsScanCancel() {
  if (!qrSetupStateGet().isAwaitingPageSelection) {
    return;
  }

  qrSetupStateSet({ isAwaitingPageSelection: false });
  await scanCancel();
}

export { qrSetupActionsScanCancel };
