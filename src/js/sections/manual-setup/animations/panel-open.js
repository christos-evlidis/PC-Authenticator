import { animCssMsGet } from "../../../utils/utility-animation.js";
import { animFrameWait } from "../../../utils/utility-animation.js";
import { animTransitionEndWait } from "../../../utils/utility-animation.js";

import { MANUAL_SETUP_ACTIVE_CLASS } from "../constants.js";
import { MANUAL_SETUP_HEADER_BTN_ACTIVE_CLASS } from "../constants.js";
import { MANUAL_SETUP_OPEN_BTN_SELECTOR } from "../constants.js";
import { MANUAL_SETUP_OPEN_CLASS } from "../constants.js";
import { MANUAL_SETUP_PANEL_ANIMATION_RUN_ID } from "../constants.js";
import { MANUAL_SETUP_PANEL_BACKDROP_CLOSING_CLASS } from "../constants.js";
import { MANUAL_SETUP_PANEL_CLOSING_CLASS } from "../constants.js";
import { MANUAL_SETUP_PANEL_OPENING_CLASS } from "../constants.js";
import { MANUAL_SETUP_PANEL_OPEN_CLASS } from "../constants.js";
import { MANUAL_SETUP_PANEL_SELECTOR } from "../constants.js";
import { MANUAL_SETUP_ROOT_SELECTOR } from "../constants.js";
import { MANUAL_SETUP_VAR_ANIMATION_TIMEOUT_BUFFER_MS } from "../constants.js";
import { MANUAL_SETUP_VAR_BLUR_MS } from "../constants.js";
import { MANUAL_SETUP_VAR_SLIDE_MS } from "../constants.js";

/** Runs the blur-then-slide open sequence for the manual setup overlay. */
async function manualSetupPanelOpenAnimation() {
  const runId = MANUAL_SETUP_PANEL_ANIMATION_RUN_ID.value + 1;
  MANUAL_SETUP_PANEL_ANIMATION_RUN_ID.value = runId;

  const root = document.querySelector(MANUAL_SETUP_ROOT_SELECTOR);
  const panel = document.querySelector(MANUAL_SETUP_PANEL_SELECTOR);

  if (!root || !panel) {
    return;
  }

  root.classList.remove(
    MANUAL_SETUP_PANEL_OPENING_CLASS,
    MANUAL_SETUP_PANEL_OPEN_CLASS,
    MANUAL_SETUP_PANEL_CLOSING_CLASS,
    MANUAL_SETUP_PANEL_BACKDROP_CLOSING_CLASS,
  );
  panel.classList.remove(
    MANUAL_SETUP_PANEL_OPENING_CLASS,
    MANUAL_SETUP_PANEL_OPEN_CLASS,
    MANUAL_SETUP_PANEL_CLOSING_CLASS,
  );

  try {
    document
      .querySelector(MANUAL_SETUP_OPEN_BTN_SELECTOR)
      ?.classList.toggle(MANUAL_SETUP_HEADER_BTN_ACTIVE_CLASS, true);
    root.classList.add(MANUAL_SETUP_ACTIVE_CLASS);
    root.classList.add(MANUAL_SETUP_OPEN_CLASS);
    root.classList.add(MANUAL_SETUP_PANEL_OPENING_CLASS);

    await animFrameWait();

    if (runId !== MANUAL_SETUP_PANEL_ANIMATION_RUN_ID.value) {
      return;
    }

    root.classList.add(MANUAL_SETUP_PANEL_OPEN_CLASS);

    await animTransitionEndWait(
      panel,
      "transform",
      animCssMsGet(root, MANUAL_SETUP_VAR_SLIDE_MS)
        + animCssMsGet(root, MANUAL_SETUP_VAR_BLUR_MS)
        + animCssMsGet(root, MANUAL_SETUP_VAR_ANIMATION_TIMEOUT_BUFFER_MS),
    );
  } finally {
    if (runId === MANUAL_SETUP_PANEL_ANIMATION_RUN_ID.value) {
      root.classList.remove(MANUAL_SETUP_PANEL_OPENING_CLASS);
    }
  }
}

export { manualSetupPanelOpenAnimation };
