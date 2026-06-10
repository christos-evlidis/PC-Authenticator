import { animAnimationEndWait } from "../../../../../utils/utility-animation.js";
import { animCssMsGet } from "../../../../../utils/utility-animation.js";
import { animDelay } from "../../../../../utils/utility-animation.js";

import { qrSetupActionLockSet } from "../../action/lock/set.js";
import { qrSetupResumeLayout } from "./prepare.js";
import { qrSetupStateSet } from "../../state/set.js";

import { QR_SETUP_CONTENT_SELECTOR } from "../../qr-code-setup-const.js";
import { QR_SETUP_HIDDEN_CLASS } from "../../qr-code-setup-const.js";
import { QR_SETUP_PANEL_SELECTOR } from "../../qr-code-setup-const.js";
import { QR_SETUP_RESUME_ANIMATION_RUN_ID } from "../../qr-code-setup-const.js";
import { QR_SETUP_RESUME_DOTS_FADE_OUT_CLASS } from "../../qr-code-setup-const.js";
import { QR_SETUP_RESUME_DOTS_RUN_CLASS } from "../../qr-code-setup-const.js";
import { QR_SETUP_RESUME_LOCKED_CLASS } from "../../qr-code-setup-const.js";
import { QR_SETUP_RESUME_RESULT_DRAW_CLASS } from "../../qr-code-setup-const.js";
import { QR_SETUP_RESUME_RESULT_FADE_OUT_CLASS } from "../../qr-code-setup-const.js";
import { QR_SETUP_RESUME_SHRINK_FULL_CLASS } from "../../qr-code-setup-const.js";
import { QR_SETUP_ROOT_SELECTOR } from "../../qr-code-setup-const.js";
import { QR_SETUP_STATUS_ERROR_SELECTOR } from "../../qr-code-setup-const.js";
import { QR_SETUP_STATUS_ICON_CIRCLE_SELECTOR } from "../../qr-code-setup-const.js";
import { QR_SETUP_STATUS_ICON_MARK_SELECTOR } from "../../qr-code-setup-const.js";
import { QR_SETUP_STATUS_LOADING_SELECTOR } from "../../qr-code-setup-const.js";
import { QR_SETUP_STATUS_SUCCESS_SELECTOR } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_ANIMATION_TIMEOUT_BUFFER_MS } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_DOTS_FADE_OUT_MS } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_DOTS_RUN_MS } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_ORIGIN_HEIGHT } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_ORIGIN_LEFT } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_ORIGIN_TOP } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_ORIGIN_WIDTH } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_RESULT_DRAW_MS } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_RESULT_FADE_OUT_MS } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_SHRINK_FULL_MS } from "../../qr-code-setup-const.js";

/** Runs loading dots, result draw, and shrink resume animation. */
async function qrSetupAnimationResumeStart(resolveWork) {
  const runId = QR_SETUP_RESUME_ANIMATION_RUN_ID.value + 1;
  QR_SETUP_RESUME_ANIMATION_RUN_ID.value = runId;

  const root = document.querySelector(QR_SETUP_ROOT_SELECTOR);
  const panel = document.querySelector(QR_SETUP_PANEL_SELECTOR);
  const content = document.querySelector(QR_SETUP_CONTENT_SELECTOR);
  const loadingStatus = document.querySelector(QR_SETUP_STATUS_LOADING_SELECTOR);
  const successStatus = document.querySelector(QR_SETUP_STATUS_SUCCESS_SELECTOR);
  const errorStatus = document.querySelector(QR_SETUP_STATUS_ERROR_SELECTOR);

  if (!root || !panel || !loadingStatus || !successStatus || !errorStatus) {
    try {
      return await resolveWork();
    } catch {
      return false;
    }
  }

  qrSetupStateSet({ isBusy: true });
  root.classList.toggle(QR_SETUP_RESUME_LOCKED_CLASS, true);
  qrSetupActionLockSet(true);

  const workPromise = (async () => {
    try {
      return await resolveWork();
    } catch {
      return false;
    }
  })();

  try {
    const dotsRunMs = animCssMsGet(panel, QR_SETUP_VAR_RESUME_DOTS_RUN_MS);
    const dotsFadeOutMs = animCssMsGet(panel, QR_SETUP_VAR_RESUME_DOTS_FADE_OUT_MS);
    const resultDrawMs = animCssMsGet(panel, QR_SETUP_VAR_RESUME_RESULT_DRAW_MS);
    const resultFadeOutMs = animCssMsGet(panel, QR_SETUP_VAR_RESUME_RESULT_FADE_OUT_MS);
    const shrinkFullMs = animCssMsGet(panel, QR_SETUP_VAR_RESUME_SHRINK_FULL_MS);
    const timeoutBufferMs = animCssMsGet(
      panel,
      QR_SETUP_VAR_ANIMATION_TIMEOUT_BUFFER_MS,
    );
    const circleDuration = Math.round(resultDrawMs * 0.45);
    const markDuration = resultDrawMs - circleDuration;
    const layout = qrSetupResumeLayout;

    if (!loadingStatus.classList.contains(QR_SETUP_RESUME_DOTS_RUN_CLASS)) {
      loadingStatus.classList.remove(QR_SETUP_HIDDEN_CLASS);
      loadingStatus.classList.add(QR_SETUP_RESUME_DOTS_RUN_CLASS);
    }

    const [, resultIsSuccess] = await Promise.all([
      animDelay(dotsRunMs),
      workPromise,
    ]);

    if (runId !== QR_SETUP_RESUME_ANIMATION_RUN_ID.value) {
      return false;
    }

    loadingStatus.classList.remove(QR_SETUP_RESUME_DOTS_RUN_CLASS);
    loadingStatus.classList.add(QR_SETUP_RESUME_DOTS_FADE_OUT_CLASS);
    await animAnimationEndWait(
      loadingStatus,
      "qrSetupStatusFadeOut",
      dotsFadeOutMs + timeoutBufferMs,
    );
    loadingStatus.classList.remove(QR_SETUP_RESUME_DOTS_FADE_OUT_CLASS);
    loadingStatus.classList.add(QR_SETUP_HIDDEN_CLASS);

    if (runId !== QR_SETUP_RESUME_ANIMATION_RUN_ID.value) {
      return false;
    }

    const resultStatus = resultIsSuccess ? successStatus : errorStatus;
    const circle = resultStatus.querySelector(QR_SETUP_STATUS_ICON_CIRCLE_SELECTOR);
    const marks = [
      ...resultStatus.querySelectorAll(QR_SETUP_STATUS_ICON_MARK_SELECTOR),
    ];

    resultStatus.classList.remove(QR_SETUP_HIDDEN_CLASS);
    resultStatus.classList.add(QR_SETUP_RESUME_RESULT_DRAW_CLASS, "is-animating");

    if (circle) {
      await animAnimationEndWait(
        circle,
        "qrSetupStatusCircleDraw",
        circleDuration + timeoutBufferMs,
      );
    }

    if (runId !== QR_SETUP_RESUME_ANIMATION_RUN_ID.value) {
      return false;
    }

    await Promise.all(
      marks.map((mark) =>
        animAnimationEndWait(mark, "qrSetupStatusMarkDraw", markDuration + timeoutBufferMs),
      ),
    );

    if (runId !== QR_SETUP_RESUME_ANIMATION_RUN_ID.value) {
      return false;
    }

    resultStatus.classList.remove("is-animating");
    resultStatus.classList.add("is-drawn");

    if (content && layout) {
      resultStatus.classList.add(QR_SETUP_RESUME_RESULT_FADE_OUT_CLASS);
      await animAnimationEndWait(
        resultStatus,
        "qrSetupStatusFadeOut",
        resultFadeOutMs + timeoutBufferMs,
      );
      resultStatus.classList.remove(
        QR_SETUP_RESUME_RESULT_DRAW_CLASS,
        QR_SETUP_RESUME_RESULT_FADE_OUT_CLASS,
        "is-drawn",
      );
      resultStatus.classList.add(QR_SETUP_HIDDEN_CLASS);

      if (runId !== QR_SETUP_RESUME_ANIMATION_RUN_ID.value) {
        return false;
      }

      content.classList.add(QR_SETUP_RESUME_SHRINK_FULL_CLASS);
      await animAnimationEndWait(
        content,
        "signInShrinkFull",
        shrinkFullMs + timeoutBufferMs,
      );
      content.style.setProperty(QR_SETUP_VAR_RESUME_ORIGIN_TOP, `${layout.expandUpTop}px`);
      content.style.setProperty(QR_SETUP_VAR_RESUME_ORIGIN_LEFT, `${layout.expandUpLeft}px`);
      content.style.setProperty(QR_SETUP_VAR_RESUME_ORIGIN_WIDTH, `${layout.expandUpWidth}px`);
      content.style.setProperty(QR_SETUP_VAR_RESUME_ORIGIN_HEIGHT, `${layout.expandUpHeight}px`);
      content.classList.remove(QR_SETUP_RESUME_SHRINK_FULL_CLASS);
    }

    return resultIsSuccess;
  } finally {
    if (runId === QR_SETUP_RESUME_ANIMATION_RUN_ID.value) {
      qrSetupStateSet({ isBusy: false, isAwaitingPageSelection: false });
      root.classList.toggle(QR_SETUP_RESUME_LOCKED_CLASS, false);
      qrSetupActionLockSet(false);
    }
  }
}

export { qrSetupAnimationResumeStart };
