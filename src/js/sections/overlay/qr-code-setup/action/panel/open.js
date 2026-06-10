import { manualSetupActionsPanelClose } from "../../../manual-setup/action/panel/close.js";
import { manualSetupStateGet } from "../../../manual-setup/state/get.js";
import { qrSetupAnimationPanelOpen } from "../../animation/panel/open.js";
import { qrSetupStateGet } from "../../state/get.js";
import { qrSetupStateSet } from "../../state/set.js";

async function qrSetupActionsPanelOpen() {
  if (qrSetupStateGet().isOpen) {
    return;
  }

  if (manualSetupStateGet().isOpen) {
    await manualSetupActionsPanelClose();
  }

  qrSetupStateSet({ isOpen: true });
  await qrSetupAnimationPanelOpen();
}

export { qrSetupActionsPanelOpen };
