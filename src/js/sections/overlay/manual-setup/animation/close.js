import { animCssMsGet } from "../../../../utils/utility-animation.js";
import { animFrameWait } from "../../../../utils/utility-animation.js";
import { animTransitionEndWait } from "../../../../utils/utility-animation.js";

import { MANUAL_SETUP_ACTIVE_CLASS } from "../../../../const/const.manual-setup.js";
import { MANUAL_SETUP_BACKDROP_SELECTOR } from "../../../../const/const.manual-setup.js";
import { MANUAL_SETUP_HEADER_BTN_ACTIVE_CLASS } from "../../../../const/const.manual-setup.js";
import { MANUAL_SETUP_OPEN_BTN_SELECTOR } from "../../../../const/const.manual-setup.js";
import { MANUAL_SETUP_OPEN_CLASS } from "../../../../const/const.manual-setup.js";
import { MANUAL_SETUP_PANEL_ANIMATION_RUN_ID } from "../../../../const/const.manual-setup.js";
import { MANUAL_SETUP_PANEL_BACKDROP_CLOSING_CLASS } from "../../../../const/const.manual-setup.js";
import { MANUAL_SETUP_PANEL_CLOSING_CLASS } from "../../../../const/const.manual-setup.js";
import { MANUAL_SETUP_PANEL_OPENING_CLASS } from "../../../../const/const.manual-setup.js";
import { MANUAL_SETUP_PANEL_OPEN_CLASS } from "../../../../const/const.manual-setup.js";
import { MANUAL_SETUP_PANEL_SELECTOR } from "../../../../const/const.manual-setup.js";
import { MANUAL_SETUP_ROOT_SELECTOR } from "../../../../const/const.manual-setup.js";
import { MANUAL_SETUP_SUBMITTING_CLASS } from "../../../../const/const.manual-setup.js";
import { MANUAL_SETUP_VAR_ANIMATION_TIMEOUT_BUFFER_MS } from "../../../../const/const.manual-setup.js";
import { MANUAL_SETUP_VAR_BLUR_MS } from "../../../../const/const.manual-setup.js";
import { MANUAL_SETUP_VAR_SLIDE_MS } from "../../../../const/const.manual-setup.js";

/** Plays the manual-setup panel close animation. */
async function manualSetupAnimationClose() {
  const runId = MANUAL_SETUP_PANEL_ANIMATION_RUN_ID.value + 1;
  MANUAL_SETUP_PANEL_ANIMATION_RUN_ID.value = runId;

  const root = document.querySelector(MANUAL_SETUP_ROOT_SELECTOR);
  const panel = document.querySelector(MANUAL_SETUP_PANEL_SELECTOR);
  const backdrop = document.querySelector(MANUAL_SETUP_BACKDROP_SELECTOR);

  if (!root || !panel) {
    return;
  }

  try {
    document
      .querySelector(MANUAL_SETUP_OPEN_BTN_SELECTOR)
      ?.classList.toggle(MANUAL_SETUP_HEADER_BTN_ACTIVE_CLASS, false);

    root.classList.add(MANUAL_SETUP_PANEL_CLOSING_CLASS);

    await animTransitionEndWait(
      panel,
      "transform",
      animCssMsGet(root, MANUAL_SETUP_VAR_SLIDE_MS)
        + animCssMsGet(root, MANUAL_SETUP_VAR_ANIMATION_TIMEOUT_BUFFER_MS),
    );

    if (runId !== MANUAL_SETUP_PANEL_ANIMATION_RUN_ID.value) {
      return;
    }

    root.classList.remove(MANUAL_SETUP_PANEL_OPEN_CLASS);
    root.classList.add(MANUAL_SETUP_PANEL_BACKDROP_CLOSING_CLASS);

    await animFrameWait();

    if (runId !== MANUAL_SETUP_PANEL_ANIMATION_RUN_ID.value) {
      return;
    }

    if (backdrop) {
      await animTransitionEndWait(
        backdrop,
        "opacity",
        animCssMsGet(root, MANUAL_SETUP_VAR_BLUR_MS)
          + animCssMsGet(root, MANUAL_SETUP_VAR_ANIMATION_TIMEOUT_BUFFER_MS),
      );
    }

    if (runId !== MANUAL_SETUP_PANEL_ANIMATION_RUN_ID.value) {
      return;
    }

    root.classList.remove(MANUAL_SETUP_OPEN_CLASS);
    root.classList.remove(MANUAL_SETUP_ACTIVE_CLASS);
    root.classList.remove(MANUAL_SETUP_SUBMITTING_CLASS);
  } finally {
    if (runId === MANUAL_SETUP_PANEL_ANIMATION_RUN_ID.value) {
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
    }
  }
}

export { manualSetupAnimationClose };
