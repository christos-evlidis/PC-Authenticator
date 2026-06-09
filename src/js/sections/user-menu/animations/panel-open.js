import { animCssMsGet } from "../../../utils/utility-animation.js";
import { animFrameWait } from "../../../utils/utility-animation.js";
import { animTransitionEndWait } from "../../../utils/utility-animation.js";

import { USER_MENU_ACTIVE_CLASS } from "../constants.js";
import { USER_MENU_VAR_ANIMATION_TIMEOUT_BUFFER_MS } from "../constants.js";
import { USER_MENU_VAR_BLUR_MS } from "../constants.js";
import { USER_MENU_HEADER_BTN_ACTIVE_CLASS } from "../constants.js";
import { USER_MENU_OPEN_BTN_SELECTOR } from "../constants.js";
import { USER_MENU_OPEN_CLASS } from "../constants.js";
import { USER_MENU_PANEL_ANIMATION_RUN_ID } from "../constants.js";
import { USER_MENU_PANEL_BACKDROP_CLOSING_CLASS } from "../constants.js";
import { USER_MENU_PANEL_CLOSING_CLASS } from "../constants.js";
import { USER_MENU_PANEL_OPENING_CLASS } from "../constants.js";
import { USER_MENU_PANEL_OPEN_CLASS } from "../constants.js";
import { USER_MENU_PANEL_SELECTOR } from "../constants.js";
import { USER_MENU_ROOT_SELECTOR } from "../constants.js";
import { USER_MENU_VAR_SLIDE_MS } from "../constants.js";

/** Runs the blur-then-slide open sequence for the user menu overlay. */
async function userMenuPanelOpenAnimation() {
  const runId = USER_MENU_PANEL_ANIMATION_RUN_ID.value + 1;
  USER_MENU_PANEL_ANIMATION_RUN_ID.value = runId;

  const root = document.querySelector(USER_MENU_ROOT_SELECTOR);
  const panel = document.querySelector(USER_MENU_PANEL_SELECTOR);

  if (!root || !panel) {
    return;
  }

  root.classList.remove(
    USER_MENU_PANEL_OPENING_CLASS,
    USER_MENU_PANEL_OPEN_CLASS,
    USER_MENU_PANEL_CLOSING_CLASS,
    USER_MENU_PANEL_BACKDROP_CLOSING_CLASS,
  );
  panel.classList.remove(
    USER_MENU_PANEL_OPENING_CLASS,
    USER_MENU_PANEL_OPEN_CLASS,
    USER_MENU_PANEL_CLOSING_CLASS,
  );

  try {
    document.querySelectorAll(USER_MENU_OPEN_BTN_SELECTOR).forEach((button) => {
      button.classList.toggle(USER_MENU_HEADER_BTN_ACTIVE_CLASS, true);
    });
    root.classList.add(USER_MENU_ACTIVE_CLASS);
    root.classList.add(USER_MENU_OPEN_CLASS);
    root.classList.add(USER_MENU_PANEL_OPENING_CLASS);

    await animFrameWait();

    if (runId !== USER_MENU_PANEL_ANIMATION_RUN_ID.value) {
      return;
    }

    root.classList.add(USER_MENU_PANEL_OPEN_CLASS);

    await animTransitionEndWait(
      panel,
      "transform",
      animCssMsGet(root, USER_MENU_VAR_SLIDE_MS)
        + animCssMsGet(root, USER_MENU_VAR_BLUR_MS)
        + animCssMsGet(root, USER_MENU_VAR_ANIMATION_TIMEOUT_BUFFER_MS),
    );
  } finally {
    if (runId === USER_MENU_PANEL_ANIMATION_RUN_ID.value) {
      root.classList.remove(USER_MENU_PANEL_OPENING_CLASS);
    }
  }
}

export { userMenuPanelOpenAnimation };
