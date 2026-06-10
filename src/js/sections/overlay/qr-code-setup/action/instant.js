import { qrSetupStateGet } from "../state/get.js";
import { qrSetupStateSet } from "../state/set.js";

import { QR_SETUP_ACTIVE_CLASS } from "../qr-code-setup-const.js";
import { QR_SETUP_HEADER_BTN_ACTIVE_CLASS } from "../qr-code-setup-const.js";
import { QR_SETUP_OPEN_BTN_SELECTOR } from "../qr-code-setup-const.js";
import { QR_SETUP_OPEN_CLASS } from "../qr-code-setup-const.js";
import { QR_SETUP_PANEL_OPEN_CLASS } from "../qr-code-setup-const.js";
import { QR_SETUP_ROOT_SELECTOR } from "../qr-code-setup-const.js";

function qrSetupActionsInstant() {
  const root = document.querySelector(QR_SETUP_ROOT_SELECTOR);

  if (!root || qrSetupStateGet().isOpen) {
    return false;
  }

  document.querySelectorAll(QR_SETUP_OPEN_BTN_SELECTOR).forEach((button) => {
    button.classList.toggle(QR_SETUP_HEADER_BTN_ACTIVE_CLASS, true);
  });
  root.classList.add(QR_SETUP_ACTIVE_CLASS, QR_SETUP_OPEN_CLASS, QR_SETUP_PANEL_OPEN_CLASS);
  qrSetupStateSet({ isOpen: true });

  return true;
}

export { qrSetupActionsInstant };
