import { animAnimationEndWait } from "../../../../../utils/utility-animation.js";
import { animCssMsGet } from "../../../../../utils/utility-animation.js";
import { animDelay } from "../../../../../utils/utility-animation.js";
import { qrSetupActionsLockSet } from "../../action/lock/set.js";
import { qrSetupStateSet } from "../../state/set.js";

import { QR_SETUP_HIDDEN_CLASS } from "../../constants.js";
import { QR_SETUP_PANEL_SELECTOR } from "../../constants.js";
import { QR_SETUP_RESUME_ANIMATION_RUN_ID } from "../../constants.js";
import { QR_SETUP_RESUME_DOTS_FADE_OUT_CLASS } from "../../constants.js";
import { QR_SETUP_RESUME_DOTS_RUN_CLASS } from "../../constants.js";
import { QR_SETUP_RESUME_LOCKED_CLASS } from "../../constants.js";
import { QR_SETUP_RESUME_RESULT_DRAW_CLASS } from "../../constants.js";
import { QR_SETUP_ROOT_SELECTOR } from "../../constants.js";
import { QR_SETUP_STATUS_ERROR_SELECTOR } from "../../constants.js";
import { QR_SETUP_STATUS_ICON_CIRCLE_SELECTOR } from "../../constants.js";
import { QR_SETUP_STATUS_ICON_MARK_SELECTOR } from "../../constants.js";
import { QR_SETUP_STATUS_LOADING_SELECTOR } from "../../constants.js";
import { QR_SETUP_STATUS_SUCCESS_SELECTOR } from "../../constants.js";
import { QR_SETUP_VAR_ANIMATION_TIMEOUT_BUFFER_MS } from "../../constants.js";
import { QR_SETUP_VAR_RESUME_DOTS_FADE_OUT_MS } from "../../constants.js";
import { QR_SETUP_VAR_RESUME_DOTS_RUN_MS } from "../../constants.js";
import { QR_SETUP_VAR_RESUME_RESULT_DRAW_MS } from "../../constants.js";

async function qrSetupAnimationResumeStart(resolveWork) {
  const runId = QR_SETUP_RESUME_ANIMATION_RUN_ID.value + 1;
  QR_SETUP_RESUME_ANIMATION_RUN_ID.value = runId;

  const root = document.querySelector(QR_SETUP_ROOT_SELECTOR);
  const panel = document.querySelector(QR_SETUP_PANEL_SELECTOR);
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
  qrSetupActionsLockSet(true);

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
    const timeoutBufferMs = animCssMsGet(
      panel,
      QR_SETUP_VAR_ANIMATION_TIMEOUT_BUFFER_MS,
    );
    const circleDuration = Math.round(resultDrawMs * 0.45);
    const markDuration = resultDrawMs - circleDuration;

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
      "loginStatusFadeOut",
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
        "loginStatusCircleDraw",
        circleDuration + timeoutBufferMs,
      );
    }

    if (runId !== QR_SETUP_RESUME_ANIMATION_RUN_ID.value) {
      return false;
    }

    await Promise.all(
      marks.map((mark) =>
        animAnimationEndWait(mark, "loginStatusMarkDraw", markDuration + timeoutBufferMs),
      ),
    );

    if (runId !== QR_SETUP_RESUME_ANIMATION_RUN_ID.value) {
      return false;
    }

    resultStatus.classList.remove("is-animating");
    resultStatus.classList.add("is-drawn");

    return resultIsSuccess;
  } finally {
    if (runId === QR_SETUP_RESUME_ANIMATION_RUN_ID.value) {
      qrSetupStateSet({ isBusy: false, isAwaitingPageSelection: false });
      root.classList.toggle(QR_SETUP_RESUME_LOCKED_CLASS, false);
      qrSetupActionsLockSet(false);
    }
  }
}

export { qrSetupAnimationResumeStart };
