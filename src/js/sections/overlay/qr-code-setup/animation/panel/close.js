import { animCssMsGet } from "../../../../../utils/utility-animation.js";
import { animFrameWait } from "../../../../../utils/utility-animation.js";
import { animTransitionEndWait } from "../../../../../utils/utility-animation.js";

import { QR_SETUP_ACTIVE_CLASS } from "../../qr-code-setup-const.js";
import { QR_SETUP_BACKDROP_SELECTOR } from "../../qr-code-setup-const.js";
import { QR_SETUP_BUSY_CLASS } from "../../qr-code-setup-const.js";
import { QR_SETUP_HEADER_BTN_ACTIVE_CLASS } from "../../qr-code-setup-const.js";
import { QR_SETUP_OPEN_BTN_SELECTOR } from "../../qr-code-setup-const.js";
import { QR_SETUP_OPEN_CLASS } from "../../qr-code-setup-const.js";
import { QR_SETUP_PANEL_ANIMATION_RUN_ID } from "../../qr-code-setup-const.js";
import { QR_SETUP_PANEL_BACKDROP_CLOSING_CLASS } from "../../qr-code-setup-const.js";
import { QR_SETUP_PANEL_CLOSING_CLASS } from "../../qr-code-setup-const.js";
import { QR_SETUP_PANEL_OPENING_CLASS } from "../../qr-code-setup-const.js";
import { QR_SETUP_PANEL_OPEN_CLASS } from "../../qr-code-setup-const.js";
import { QR_SETUP_PANEL_SELECTOR } from "../../qr-code-setup-const.js";
import { QR_SETUP_ROOT_SELECTOR } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_ANIMATION_TIMEOUT_BUFFER_MS } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_BLUR_MS } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_SLIDE_MS } from "../../qr-code-setup-const.js";

/** Plays the QR panel close slide and backdrop fade. */
async function qrSetupAnimationPanelClose() {
  const runId = QR_SETUP_PANEL_ANIMATION_RUN_ID.value + 1;
  QR_SETUP_PANEL_ANIMATION_RUN_ID.value = runId;

  const root = document.querySelector(QR_SETUP_ROOT_SELECTOR);
  const panel = document.querySelector(QR_SETUP_PANEL_SELECTOR);
  const backdrop = document.querySelector(QR_SETUP_BACKDROP_SELECTOR);

  if (!root || !panel) {
    return;
  }

  try {
    document.querySelectorAll(QR_SETUP_OPEN_BTN_SELECTOR).forEach((button) => {
      button.classList.toggle(QR_SETUP_HEADER_BTN_ACTIVE_CLASS, false);
      button.blur();
    });

    root.classList.add(QR_SETUP_PANEL_CLOSING_CLASS);

    await animTransitionEndWait(
      panel,
      "transform",
      animCssMsGet(root, QR_SETUP_VAR_SLIDE_MS)
        + animCssMsGet(root, QR_SETUP_VAR_ANIMATION_TIMEOUT_BUFFER_MS),
    );

    if (runId !== QR_SETUP_PANEL_ANIMATION_RUN_ID.value) {
      return;
    }

    root.classList.remove(QR_SETUP_PANEL_OPEN_CLASS);
    root.classList.add(QR_SETUP_PANEL_BACKDROP_CLOSING_CLASS);

    await animFrameWait();

    if (runId !== QR_SETUP_PANEL_ANIMATION_RUN_ID.value) {
      return;
    }

    if (backdrop) {
      await animTransitionEndWait(
        backdrop,
        "opacity",
        animCssMsGet(root, QR_SETUP_VAR_BLUR_MS)
          + animCssMsGet(root, QR_SETUP_VAR_ANIMATION_TIMEOUT_BUFFER_MS),
      );
    }

    if (runId !== QR_SETUP_PANEL_ANIMATION_RUN_ID.value) {
      return;
    }

    root.classList.remove(QR_SETUP_OPEN_CLASS);
    root.classList.remove(QR_SETUP_ACTIVE_CLASS);
    root.classList.remove(QR_SETUP_BUSY_CLASS);
  } finally {
    if (runId === QR_SETUP_PANEL_ANIMATION_RUN_ID.value) {
      root.classList.remove(
        QR_SETUP_PANEL_OPENING_CLASS,
        QR_SETUP_PANEL_OPEN_CLASS,
        QR_SETUP_PANEL_CLOSING_CLASS,
        QR_SETUP_PANEL_BACKDROP_CLOSING_CLASS,
      );
      panel.classList.remove(
        QR_SETUP_PANEL_OPENING_CLASS,
        QR_SETUP_PANEL_OPEN_CLASS,
        QR_SETUP_PANEL_CLOSING_CLASS,
      );
    }
  }
}

export { qrSetupAnimationPanelClose };
