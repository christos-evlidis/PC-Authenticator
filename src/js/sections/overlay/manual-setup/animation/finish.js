import { animPhaseReset } from "../../../../utils/utility-animation.js";

import { MANUAL_SETUP_CONTENT_SELECTOR } from "../manual-setup-const.js";
import { MANUAL_SETUP_HIDDEN_CLASS } from "../manual-setup-const.js";
import { MANUAL_SETUP_PANEL_SELECTOR } from "../manual-setup-const.js";
import { MANUAL_SETUP_ROOT_SELECTOR } from "../manual-setup-const.js";
import { MANUAL_SETUP_STATUS_ERROR_SELECTOR } from "../manual-setup-const.js";
import { MANUAL_SETUP_STATUS_LOADING_SELECTOR } from "../manual-setup-const.js";
import { MANUAL_SETUP_STATUS_SUCCESS_SELECTOR } from "../manual-setup-const.js";
import { MANUAL_SETUP_SUBMIT_CONTENT_PHASE_CLASSES } from "../manual-setup-const.js";
import { MANUAL_SETUP_SUBMIT_DOTS_FADE_IN_CLASS } from "../manual-setup-const.js";
import { MANUAL_SETUP_SUBMIT_DOTS_FADE_OUT_CLASS } from "../manual-setup-const.js";
import { MANUAL_SETUP_SUBMIT_DOTS_RUN_CLASS } from "../manual-setup-const.js";
import { MANUAL_SETUP_SUBMIT_FADE_CLASS } from "../manual-setup-const.js";
import { MANUAL_SETUP_SUBMIT_FADE_SELECTORS } from "../manual-setup-const.js";
import { MANUAL_SETUP_SUBMIT_LAYOUT_VARS } from "../manual-setup-const.js";
import { MANUAL_SETUP_SUBMIT_LOCKED_CLASS } from "../manual-setup-const.js";
import { MANUAL_SETUP_SUBMIT_RESULT_DRAW_CLASS } from "../manual-setup-const.js";
import { MANUAL_SETUP_SUBMIT_RESULT_FADE_OUT_CLASS } from "../manual-setup-const.js";
import { MANUAL_SETUP_SUBMIT_RESTORE_FADE_CLASS } from "../manual-setup-const.js";
import { MANUAL_SETUP_SUBMIT_RUNNING_CLASS } from "../manual-setup-const.js";

/** Resets manual-setup submit animation classes and layout. */
function manualSetupAnimationSubmitFinish() {
  const root = document.querySelector(MANUAL_SETUP_ROOT_SELECTOR);
  const panel = document.querySelector(MANUAL_SETUP_PANEL_SELECTOR);
  const content = document.querySelector(MANUAL_SETUP_CONTENT_SELECTOR);
  const loadingStatus = document.querySelector(MANUAL_SETUP_STATUS_LOADING_SELECTOR);
  const successStatus = document.querySelector(MANUAL_SETUP_STATUS_SUCCESS_SELECTOR);
  const errorStatus = document.querySelector(MANUAL_SETUP_STATUS_ERROR_SELECTOR);

  if (content) {
    animPhaseReset(content, ...MANUAL_SETUP_SUBMIT_CONTENT_PHASE_CLASSES);
    MANUAL_SETUP_SUBMIT_LAYOUT_VARS.forEach((layoutVar) => {
      content.style.removeProperty(layoutVar);
    });
  }

  panel?.classList.remove(
    MANUAL_SETUP_SUBMIT_RUNNING_CLASS,
    MANUAL_SETUP_SUBMIT_FADE_CLASS,
    MANUAL_SETUP_SUBMIT_RESTORE_FADE_CLASS,
  );
  panel?.querySelectorAll(MANUAL_SETUP_SUBMIT_FADE_SELECTORS).forEach((element) => {
    element.style.removeProperty("opacity");
    element.style.removeProperty("visibility");
    element.style.removeProperty("pointer-events");
  });

  [loadingStatus, successStatus, errorStatus].forEach((status) => {
    if (!status) {
      return;
    }

    status.classList.add(MANUAL_SETUP_HIDDEN_CLASS);
    status.classList.remove(
      MANUAL_SETUP_SUBMIT_DOTS_FADE_IN_CLASS,
      MANUAL_SETUP_SUBMIT_DOTS_RUN_CLASS,
      MANUAL_SETUP_SUBMIT_DOTS_FADE_OUT_CLASS,
      MANUAL_SETUP_SUBMIT_RESULT_DRAW_CLASS,
      MANUAL_SETUP_SUBMIT_RESULT_FADE_OUT_CLASS,
      "is-animating",
      "is-drawn",
    );
  });

  root?.classList.toggle(MANUAL_SETUP_SUBMIT_LOCKED_CLASS, false);
}

export { manualSetupAnimationSubmitFinish };
