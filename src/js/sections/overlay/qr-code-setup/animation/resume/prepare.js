import { qrSetupAnimationResumeReset } from "./reset.js";

import { QR_SETUP_CONTENT_SELECTOR } from "../../qr-code-setup-const.js";
import { QR_SETUP_HIDDEN_CLASS } from "../../qr-code-setup-const.js";
import { QR_SETUP_PANEL_SELECTOR } from "../../qr-code-setup-const.js";
import { QR_SETUP_RESUME_ABSOLUTE_CLASS } from "../../qr-code-setup-const.js";
import { QR_SETUP_RESUME_DOTS_RUN_CLASS } from "../../qr-code-setup-const.js";
import { QR_SETUP_RESUME_RUNNING_CLASS } from "../../qr-code-setup-const.js";
import { QR_SETUP_ROOT_SELECTOR } from "../../qr-code-setup-const.js";
import { QR_SETUP_STATUS_ERROR_SELECTOR } from "../../qr-code-setup-const.js";
import { QR_SETUP_STATUS_LOADING_SELECTOR } from "../../qr-code-setup-const.js";
import { QR_SETUP_STATUS_SUCCESS_SELECTOR } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_FULL_HEIGHT } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_FULL_LEFT } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_FULL_TOP } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_FULL_WIDTH } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_ORIGIN_HEIGHT } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_ORIGIN_LEFT } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_ORIGIN_TOP } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_ORIGIN_WIDTH } from "../../qr-code-setup-const.js";

function qrSetupAnimationResumePrepare() {
  const root = document.querySelector(QR_SETUP_ROOT_SELECTOR);
  const panel = document.querySelector(QR_SETUP_PANEL_SELECTOR);
  const content = document.querySelector(QR_SETUP_CONTENT_SELECTOR);
  const loadingStatus = document.querySelector(QR_SETUP_STATUS_LOADING_SELECTOR);
  const successStatus = document.querySelector(QR_SETUP_STATUS_SUCCESS_SELECTOR);
  const errorStatus = document.querySelector(QR_SETUP_STATUS_ERROR_SELECTOR);

  if (
    !root ||
    !panel ||
    !content ||
    !loadingStatus ||
    !successStatus ||
    !errorStatus
  ) {
    return;
  }

  qrSetupAnimationResumeReset();

  const fullTop = 0;
  const fullLeft = 0;
  const fullWidth = panel.offsetWidth;
  const fullHeight = panel.offsetHeight;

  panel.classList.add(QR_SETUP_RESUME_RUNNING_CLASS);
  panel.style.position = "relative";

  content.style.setProperty(QR_SETUP_VAR_RESUME_ORIGIN_TOP, `${fullTop}px`);
  content.style.setProperty(QR_SETUP_VAR_RESUME_ORIGIN_LEFT, `${fullLeft}px`);
  content.style.setProperty(QR_SETUP_VAR_RESUME_ORIGIN_WIDTH, `${fullWidth}px`);
  content.style.setProperty(QR_SETUP_VAR_RESUME_ORIGIN_HEIGHT, `${fullHeight}px`);
  content.style.setProperty(QR_SETUP_VAR_RESUME_FULL_TOP, `${fullTop}px`);
  content.style.setProperty(QR_SETUP_VAR_RESUME_FULL_LEFT, `${fullLeft}px`);
  content.style.setProperty(QR_SETUP_VAR_RESUME_FULL_WIDTH, `${fullWidth}px`);
  content.style.setProperty(QR_SETUP_VAR_RESUME_FULL_HEIGHT, `${fullHeight}px`);
  content.classList.add(QR_SETUP_RESUME_ABSOLUTE_CLASS);

  loadingStatus.classList.remove(QR_SETUP_HIDDEN_CLASS);
  loadingStatus.classList.add(QR_SETUP_RESUME_DOTS_RUN_CLASS);
}

export { qrSetupAnimationResumePrepare };
