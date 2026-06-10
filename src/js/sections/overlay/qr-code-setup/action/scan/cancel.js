import { qrSetupStateGet } from "../../state/get.js";
import { qrSetupStateSet } from "../../state/set.js";
import { scanCancel } from "../../../../../scan/scan-index.js";

async function qrSetupActionsScanCancel() {
  if (!qrSetupStateGet().isAwaitingPageSelection) {
    return;
  }

  qrSetupStateSet({ isAwaitingPageSelection: false });
  await scanCancel();
}

export { qrSetupActionsScanCancel };
