import { qrSetupStateSet } from "../state/set.js";

function qrSetupHandleCancel() {
  qrSetupStateSet({ isAwaitingPageSelection: false });
}

export { qrSetupHandleCancel };
