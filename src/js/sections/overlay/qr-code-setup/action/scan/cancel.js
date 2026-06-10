import { qrSetupStateSet } from "../../state/set.js";
import { scanCancel } from "../../../../../scan/scan-index.js";

export let qrSetupScanCancelGeneration = 0;

async function qrSetupActionsScanCancel() {
  qrSetupScanCancelGeneration += 1;
  qrSetupStateSet({ isAwaitingPageSelection: false });
  await scanCancel();
}

export { qrSetupActionsScanCancel };
