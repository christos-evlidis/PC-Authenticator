import { qrSetupStateGet } from "../state/get.js";
import { qrSetupStateSet } from "../state/set.js";

/** Clears awaiting-page-selection when an active scan is cancelled remotely. */
function qrSetupHandleCancel() {
  if (!qrSetupStateGet().isAwaitingPageSelection) {
    return;
  }

  qrSetupStateSet({ isAwaitingPageSelection: false });
}
export { qrSetupHandleCancel };
