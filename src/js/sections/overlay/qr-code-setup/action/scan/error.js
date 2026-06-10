import { qrSetupActionInstant } from "../instant.js";
import { qrSetupActionPanelOpen } from "../panel/open.js";

/** Opens the QR panel after a scan failure. */
async function qrSetupActionScanError(options = {}) {
  const { instantOpen = false } = options;

  if (instantOpen) {
    qrSetupActionInstant();
  } else {
    await qrSetupActionPanelOpen();
  }
}

export { qrSetupActionScanError };
