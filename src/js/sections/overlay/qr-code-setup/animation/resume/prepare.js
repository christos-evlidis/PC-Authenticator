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
import { QR_SETUP_VAR_RESUME_EXPAND_HEIGHT } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_EXPAND_LEFT } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_EXPAND_TOP } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_EXPAND_WIDTH } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_FULL_HEIGHT } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_FULL_LEFT } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_FULL_TOP } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_FULL_WIDTH } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_ORIGIN_HEIGHT } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_ORIGIN_LEFT } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_ORIGIN_TOP } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_ORIGIN_WIDTH } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_RESTORE_HEIGHT } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_RESTORE_LEFT } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_RESTORE_TOP } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_RESTORE_WIDTH } from "../../qr-code-setup-const.js";

export let qrSetupResumeLayout = null;

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

  const panelRect = panel.getBoundingClientRect();
  const contentRect = content.getBoundingClientRect();
  const panelStyles = getComputedStyle(panel);
  const panelPaddingTop = Number.parseFloat(panelStyles.paddingTop) || 12;

  qrSetupResumeLayout = {
    originTop: contentRect.top - panelRect.top,
    originLeft: contentRect.left - panelRect.left,
    originWidth: contentRect.width,
    originHeight: contentRect.height,
    expandUpTop: panelPaddingTop,
    expandUpLeft: contentRect.left - panelRect.left,
    expandUpWidth: contentRect.width,
    expandUpHeight: contentRect.bottom - panelRect.top - panelPaddingTop,
    fullTop: 0,
    fullLeft: 0,
    fullWidth: panel.offsetWidth,
    fullHeight: panel.offsetHeight,
  };

  const layout = qrSetupResumeLayout;

  panel.classList.add(QR_SETUP_RESUME_RUNNING_CLASS);
  panel.style.position = "relative";

  content.style.setProperty(QR_SETUP_VAR_RESUME_ORIGIN_TOP, `${layout.originTop}px`);
  content.style.setProperty(QR_SETUP_VAR_RESUME_ORIGIN_LEFT, `${layout.originLeft}px`);
  content.style.setProperty(QR_SETUP_VAR_RESUME_ORIGIN_WIDTH, `${layout.originWidth}px`);
  content.style.setProperty(QR_SETUP_VAR_RESUME_ORIGIN_HEIGHT, `${layout.originHeight}px`);
  content.style.setProperty(QR_SETUP_VAR_RESUME_EXPAND_TOP, `${layout.expandUpTop}px`);
  content.style.setProperty(QR_SETUP_VAR_RESUME_EXPAND_LEFT, `${layout.expandUpLeft}px`);
  content.style.setProperty(QR_SETUP_VAR_RESUME_EXPAND_WIDTH, `${layout.expandUpWidth}px`);
  content.style.setProperty(QR_SETUP_VAR_RESUME_EXPAND_HEIGHT, `${layout.expandUpHeight}px`);
  content.style.setProperty(QR_SETUP_VAR_RESUME_FULL_TOP, `${layout.fullTop}px`);
  content.style.setProperty(QR_SETUP_VAR_RESUME_FULL_LEFT, `${layout.fullLeft}px`);
  content.style.setProperty(QR_SETUP_VAR_RESUME_FULL_WIDTH, `${layout.fullWidth}px`);
  content.style.setProperty(QR_SETUP_VAR_RESUME_FULL_HEIGHT, `${layout.fullHeight}px`);
  content.style.setProperty(QR_SETUP_VAR_RESUME_RESTORE_TOP, `${layout.originTop}px`);
  content.style.setProperty(QR_SETUP_VAR_RESUME_RESTORE_LEFT, `${layout.originLeft}px`);
  content.style.setProperty(QR_SETUP_VAR_RESUME_RESTORE_WIDTH, `${layout.originWidth}px`);
  content.style.setProperty(QR_SETUP_VAR_RESUME_RESTORE_HEIGHT, `${layout.originHeight}px`);
  content.classList.add(QR_SETUP_RESUME_ABSOLUTE_CLASS);

  content.style.setProperty(QR_SETUP_VAR_RESUME_ORIGIN_TOP, `${layout.fullTop}px`);
  content.style.setProperty(QR_SETUP_VAR_RESUME_ORIGIN_LEFT, `${layout.fullLeft}px`);
  content.style.setProperty(QR_SETUP_VAR_RESUME_ORIGIN_WIDTH, `${layout.fullWidth}px`);
  content.style.setProperty(QR_SETUP_VAR_RESUME_ORIGIN_HEIGHT, `${layout.fullHeight}px`);

  loadingStatus.classList.remove(QR_SETUP_HIDDEN_CLASS);
  loadingStatus.classList.add(QR_SETUP_RESUME_DOTS_RUN_CLASS);
}

export { qrSetupAnimationResumePrepare };
