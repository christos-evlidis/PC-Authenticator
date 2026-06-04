import { cssMs } from "../../../utils/utility-animation.js";
import { waitForNextFrame } from "../../../utils/utility-animation.js";
import { waitForTransitionEnd } from "../../../utils/utility-animation.js";
import { USER_MENU_ACTIVE_CLASS } from "../constants.js";
import { USER_MENU_BACKDROP_SELECTOR } from "../constants.js";
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

// Runs the slide-then-unblur close sequence for the user menu overlay.
export async function userMenuPanelCloseAnimation() {
  const runId = USER_MENU_PANEL_ANIMATION_RUN_ID.value + 1;
  USER_MENU_PANEL_ANIMATION_RUN_ID.value = runId;

  const root = document.querySelector(USER_MENU_ROOT_SELECTOR);
  const panel = document.querySelector(USER_MENU_PANEL_SELECTOR);
  const backdrop = document.querySelector(USER_MENU_BACKDROP_SELECTOR);

  if (!root || !panel) {
    return;
  }

  try {
    document
      .querySelector(USER_MENU_OPEN_BTN_SELECTOR)
      ?.classList.toggle(USER_MENU_HEADER_BTN_ACTIVE_CLASS, false);

    root.classList.add(USER_MENU_PANEL_CLOSING_CLASS);

    await waitForTransitionEnd(
      panel,
      "transform",
      cssMs(root, USER_MENU_VAR_SLIDE_MS) + cssMs(root, USER_MENU_VAR_ANIMATION_TIMEOUT_BUFFER_MS),
    );

    if (runId !== USER_MENU_PANEL_ANIMATION_RUN_ID.value) {
      return;
    }

    root.classList.remove(USER_MENU_PANEL_OPEN_CLASS);
    root.classList.add(USER_MENU_PANEL_BACKDROP_CLOSING_CLASS);

    await waitForNextFrame();

    if (runId !== USER_MENU_PANEL_ANIMATION_RUN_ID.value) {
      return;
    }

    if (backdrop) {
      await waitForTransitionEnd(
        backdrop,
        "opacity",
        cssMs(root, USER_MENU_VAR_BLUR_MS) + cssMs(root, USER_MENU_VAR_ANIMATION_TIMEOUT_BUFFER_MS),
      );
    }

    if (runId !== USER_MENU_PANEL_ANIMATION_RUN_ID.value) {
      return;
    }

    root.classList.remove(USER_MENU_OPEN_CLASS);
    root.classList.remove(USER_MENU_ACTIVE_CLASS);
  } finally {
    if (runId === USER_MENU_PANEL_ANIMATION_RUN_ID.value) {
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
    }
  }
}
