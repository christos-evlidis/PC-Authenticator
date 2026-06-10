import { manualSetupActionPanelClose } from "../../../manual-setup/action/panel/close.js";
import { manualSetupStateGet } from "../../../manual-setup/state/get.js";

import { qrSetupAnimationPanelOpen } from "../../animation/panel/open.js";
import { qrSetupStateGet } from "../../state/get.js";
import { qrSetupStateSet } from "../../state/set.js";

/** Closes manual setup if open and animates the QR panel open. */
async function qrSetupActionPanelOpen() {
  if (qrSetupStateGet().isOpen) {
    return;
  }

  if (manualSetupStateGet().isOpen) {
    await manualSetupActionPanelClose();
  }

  qrSetupStateSet({ isOpen: true });
  await qrSetupAnimationPanelOpen();
}

export { qrSetupActionPanelOpen };
