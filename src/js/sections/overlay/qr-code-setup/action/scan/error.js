import { qrSetupActionsInstant } from "../instant.js";
import { qrSetupActionsPanelOpen } from "../panel/open.js";

async function qrSetupActionsScanError(options = {}) {
  const { instantOpen = false } = options;

  if (instantOpen) {
    qrSetupActionsInstant();
  } else {
    await qrSetupActionsPanelOpen();
  }
}

export { qrSetupActionsScanError };
