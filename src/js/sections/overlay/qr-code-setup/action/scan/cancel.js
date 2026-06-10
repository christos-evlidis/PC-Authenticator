import { scanCancel } from "../../../../../scan/scan-index.js";

import { qrSetupStateSet } from "../../state/set.js";

let qrSetupScanCancelGeneration = 0;

/** Bumps cancel generation and stops an active page scan. */
async function qrSetupActionScanCancel() {
  qrSetupScanCancelGeneration += 1;
  qrSetupStateSet({ isAwaitingPageSelection: false });
  await scanCancel();
}

export { qrSetupActionScanCancel };
export { qrSetupScanCancelGeneration };
