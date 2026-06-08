import { cross } from "../../section-cross.js";
import { qrSetupPanelOpenAnimation } from "../animations/panel-open.js";
import { qrSetupGuideReset } from "../guide.js";
import { qrSetupStateGet } from "../state.js";
import { qrSetupStateSet } from "../state.js";

import { QR_SETUP_ACTIVE_CLASS } from "../constants.js";
import { QR_SETUP_HEADER_BTN_ACTIVE_CLASS } from "../constants.js";
import { QR_SETUP_OPEN_BTN_SELECTOR } from "../constants.js";
import { QR_SETUP_OPEN_CLASS } from "../constants.js";
import { QR_SETUP_PANEL_OPEN_CLASS } from "../constants.js";
import { QR_SETUP_ROOT_SELECTOR } from "../constants.js";

/** Opens the QR setup panel without playing the entrance animation. */
function qrSetupPanelOpenInstant() {
  const root = document.querySelector(QR_SETUP_ROOT_SELECTOR);

  if (!root || qrSetupStateGet().isOpen) {
    return false;
  }

  qrSetupGuideReset();
  document.querySelectorAll(QR_SETUP_OPEN_BTN_SELECTOR).forEach((button) => {
    button.classList.toggle(QR_SETUP_HEADER_BTN_ACTIVE_CLASS, true);
  });
  root.classList.add(QR_SETUP_ACTIVE_CLASS, QR_SETUP_OPEN_CLASS, QR_SETUP_PANEL_OPEN_CLASS);
  qrSetupStateSet({ isOpen: true });

  return true;
}

/** Opens the QR setup panel and plays the entrance sequence. */
async function qrSetupPanelOpen() {
  if (qrSetupStateGet().isOpen) {
    return;
  }

  if (cross.manualSetup.isActive()) {
    await cross.manualSetup.close();
  }

  qrSetupGuideReset();
  qrSetupStateSet({ isOpen: true });
  await qrSetupPanelOpenAnimation();
}

export { qrSetupPanelOpen };
export { qrSetupPanelOpenInstant };
