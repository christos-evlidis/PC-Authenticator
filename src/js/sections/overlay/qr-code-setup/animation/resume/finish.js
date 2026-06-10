import { animPhaseReset } from "../../../../../utils/utility-animation.js";

import { QR_SETUP_CONTENT_SELECTOR } from "../../constants.js";
import { QR_SETUP_HIDDEN_CLASS } from "../../constants.js";
import { QR_SETUP_PANEL_SELECTOR } from "../../constants.js";
import { QR_SETUP_RESUME_CONTENT_PHASE_CLASSES } from "../../constants.js";
import { QR_SETUP_RESUME_DOTS_FADE_OUT_CLASS } from "../../constants.js";
import { QR_SETUP_RESUME_DOTS_RUN_CLASS } from "../../constants.js";
import { QR_SETUP_RESUME_FADE_CLASS } from "../../constants.js";
import { QR_SETUP_RESUME_FADE_SELECTORS } from "../../constants.js";
import { QR_SETUP_RESUME_LAYOUT_VARS } from "../../constants.js";
import { QR_SETUP_RESUME_LOCKED_CLASS } from "../../constants.js";
import { QR_SETUP_RESUME_RESULT_DRAW_CLASS } from "../../constants.js";
import { QR_SETUP_RESUME_RUNNING_CLASS } from "../../constants.js";
import { QR_SETUP_ROOT_SELECTOR } from "../../constants.js";
import { QR_SETUP_STATUS_ERROR_SELECTOR } from "../../constants.js";
import { QR_SETUP_STATUS_LOADING_SELECTOR } from "../../constants.js";
import { QR_SETUP_STATUS_SUCCESS_SELECTOR } from "../../constants.js";

function qrSetupAnimationResumeFinish() {
  const root = document.querySelector(QR_SETUP_ROOT_SELECTOR);
  const panel = document.querySelector(QR_SETUP_PANEL_SELECTOR);
  const content = document.querySelector(QR_SETUP_CONTENT_SELECTOR);
  const loadingStatus = document.querySelector(QR_SETUP_STATUS_LOADING_SELECTOR);
  const successStatus = document.querySelector(QR_SETUP_STATUS_SUCCESS_SELECTOR);
  const errorStatus = document.querySelector(QR_SETUP_STATUS_ERROR_SELECTOR);

  if (content) {
    animPhaseReset(content, ...QR_SETUP_RESUME_CONTENT_PHASE_CLASSES);
    QR_SETUP_RESUME_LAYOUT_VARS.forEach((layoutVar) => {
      content.style.removeProperty(layoutVar);
    });
  }

  panel?.classList.remove(QR_SETUP_RESUME_RUNNING_CLASS, QR_SETUP_RESUME_FADE_CLASS);
  panel?.style.removeProperty("position");
  panel?.querySelectorAll(QR_SETUP_RESUME_FADE_SELECTORS).forEach((element) => {
    element.style.removeProperty("opacity");
    element.style.removeProperty("visibility");
    element.style.removeProperty("pointer-events");
  });

  [loadingStatus, successStatus, errorStatus].forEach((status) => {
    if (!status) {
      return;
    }

    status.classList.add(QR_SETUP_HIDDEN_CLASS);
    status.classList.remove(
      QR_SETUP_RESUME_DOTS_RUN_CLASS,
      QR_SETUP_RESUME_DOTS_FADE_OUT_CLASS,
      QR_SETUP_RESUME_RESULT_DRAW_CLASS,
      "is-animating",
      "is-drawn",
    );
  });

  root?.classList.toggle(QR_SETUP_RESUME_LOCKED_CLASS, false);
}

export { qrSetupAnimationResumeFinish };
