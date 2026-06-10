import { qrSetupStateSet } from "../state/set.js";

/** Clears awaiting-page-selection when scan is cancelled remotely. */
function qrSetupHandleCancel() {
  qrSetupStateSet({ isAwaitingPageSelection: false });
}

export { qrSetupHandleCancel };
