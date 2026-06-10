import { animAnimationEndWait } from "../../../../utils/utility-animation.js";
import { animCssMsGet } from "../../../../utils/utility-animation.js";
import { animDelay } from "../../../../utils/utility-animation.js";
import { animFrameWait } from "../../../../utils/utility-animation.js";
import { animPhaseReset } from "../../../../utils/utility-animation.js";

import { manualSetupStateSet } from "../state/set.js";

import { MANUAL_SETUP_CONTENT_SELECTOR } from "../manual-setup-const.js";
import { MANUAL_SETUP_HIDDEN_CLASS } from "../manual-setup-const.js";
import { MANUAL_SETUP_PANEL_SELECTOR } from "../manual-setup-const.js";
import { MANUAL_SETUP_ROOT_SELECTOR } from "../manual-setup-const.js";
import { MANUAL_SETUP_STATUS_ERROR_SELECTOR } from "../manual-setup-const.js";
import { MANUAL_SETUP_STATUS_ICON_CIRCLE_SELECTOR } from "../manual-setup-const.js";
import { MANUAL_SETUP_STATUS_ICON_MARK_SELECTOR } from "../manual-setup-const.js";
import { MANUAL_SETUP_STATUS_LOADING_SELECTOR } from "../manual-setup-const.js";
import { MANUAL_SETUP_STATUS_SUCCESS_SELECTOR } from "../manual-setup-const.js";
import { MANUAL_SETUP_SUBMIT_ABSOLUTE_CLASS } from "../manual-setup-const.js";
import { MANUAL_SETUP_SUBMIT_ANIMATION_RUN_ID } from "../manual-setup-const.js";
import { MANUAL_SETUP_SUBMIT_CONTENT_PHASE_CLASSES } from "../manual-setup-const.js";
import { MANUAL_SETUP_SUBMIT_DOTS_FADE_IN_CLASS } from "../manual-setup-const.js";
import { MANUAL_SETUP_SUBMIT_DOTS_FADE_OUT_CLASS } from "../manual-setup-const.js";
import { MANUAL_SETUP_SUBMIT_DOTS_RUN_CLASS } from "../manual-setup-const.js";
import { MANUAL_SETUP_SUBMIT_EXPAND_FULL_CLASS } from "../manual-setup-const.js";
import { MANUAL_SETUP_SUBMIT_EXPAND_UP_CLASS } from "../manual-setup-const.js";
import { MANUAL_SETUP_SUBMIT_FADE_CLASS } from "../manual-setup-const.js";
import { MANUAL_SETUP_SUBMIT_FADE_SELECTORS } from "../manual-setup-const.js";
import { MANUAL_SETUP_SUBMIT_LAYOUT_VARS } from "../manual-setup-const.js";
import { MANUAL_SETUP_SUBMIT_LOCKED_CLASS } from "../manual-setup-const.js";
import { MANUAL_SETUP_SUBMIT_RESULT_DRAW_CLASS } from "../manual-setup-const.js";
import { MANUAL_SETUP_SUBMIT_RESULT_FADE_OUT_CLASS } from "../manual-setup-const.js";
import { MANUAL_SETUP_SUBMIT_RESTORE_FADE_CLASS } from "../manual-setup-const.js";
import { MANUAL_SETUP_SUBMIT_RUNNING_CLASS } from "../manual-setup-const.js";
import { MANUAL_SETUP_SUBMIT_SHRINK_FULL_CLASS } from "../manual-setup-const.js";
import { MANUAL_SETUP_VAR_ANIMATION_TIMEOUT_BUFFER_MS } from "../manual-setup-const.js";
import { MANUAL_SETUP_VAR_SUBMIT_DOTS_FADE_IN_MS } from "../manual-setup-const.js";
import { MANUAL_SETUP_VAR_SUBMIT_DOTS_FADE_OUT_MS } from "../manual-setup-const.js";
import { MANUAL_SETUP_VAR_SUBMIT_DOTS_RUN_MS } from "../manual-setup-const.js";
import { MANUAL_SETUP_VAR_SUBMIT_EXPAND_FULL_MS } from "../manual-setup-const.js";
import { MANUAL_SETUP_VAR_SUBMIT_EXPAND_HEIGHT } from "../manual-setup-const.js";
import { MANUAL_SETUP_VAR_SUBMIT_EXPAND_LEFT } from "../manual-setup-const.js";
import { MANUAL_SETUP_VAR_SUBMIT_EXPAND_TOP } from "../manual-setup-const.js";
import { MANUAL_SETUP_VAR_SUBMIT_EXPAND_UP_MS } from "../manual-setup-const.js";
import { MANUAL_SETUP_VAR_SUBMIT_EXPAND_WIDTH } from "../manual-setup-const.js";
import { MANUAL_SETUP_VAR_SUBMIT_FADE_MS } from "../manual-setup-const.js";
import { MANUAL_SETUP_VAR_SUBMIT_FULL_HEIGHT } from "../manual-setup-const.js";
import { MANUAL_SETUP_VAR_SUBMIT_FULL_LEFT } from "../manual-setup-const.js";
import { MANUAL_SETUP_VAR_SUBMIT_FULL_TOP } from "../manual-setup-const.js";
import { MANUAL_SETUP_VAR_SUBMIT_FULL_WIDTH } from "../manual-setup-const.js";
import { MANUAL_SETUP_VAR_SUBMIT_ORIGIN_HEIGHT } from "../manual-setup-const.js";
import { MANUAL_SETUP_VAR_SUBMIT_ORIGIN_LEFT } from "../manual-setup-const.js";
import { MANUAL_SETUP_VAR_SUBMIT_ORIGIN_TOP } from "../manual-setup-const.js";
import { MANUAL_SETUP_VAR_SUBMIT_ORIGIN_WIDTH } from "../manual-setup-const.js";
import { MANUAL_SETUP_VAR_SUBMIT_RESTORE_HEIGHT } from "../manual-setup-const.js";
import { MANUAL_SETUP_VAR_SUBMIT_RESTORE_LEFT } from "../manual-setup-const.js";
import { MANUAL_SETUP_VAR_SUBMIT_RESTORE_TOP } from "../manual-setup-const.js";
import { MANUAL_SETUP_VAR_SUBMIT_RESTORE_WIDTH } from "../manual-setup-const.js";
import { MANUAL_SETUP_VAR_SUBMIT_RESULT_DRAW_MS } from "../manual-setup-const.js";
import { MANUAL_SETUP_VAR_SUBMIT_RESULT_FADE_OUT_MS } from "../manual-setup-const.js";
import { MANUAL_SETUP_VAR_SUBMIT_SHRINK_FULL_MS } from "../manual-setup-const.js";

/** Runs the manual-setup submit loading and result animation. */
async function manualSetupAnimationSubmit(resolveSubmit) {
  const runId = MANUAL_SETUP_SUBMIT_ANIMATION_RUN_ID.value + 1;
  MANUAL_SETUP_SUBMIT_ANIMATION_RUN_ID.value = runId;

  const root = document.querySelector(MANUAL_SETUP_ROOT_SELECTOR);
  const panel = document.querySelector(MANUAL_SETUP_PANEL_SELECTOR);
  const content = document.querySelector(MANUAL_SETUP_CONTENT_SELECTOR);
  const loadingStatus = document.querySelector(MANUAL_SETUP_STATUS_LOADING_SELECTOR);
  const successStatus = document.querySelector(MANUAL_SETUP_STATUS_SUCCESS_SELECTOR);
  const errorStatus = document.querySelector(MANUAL_SETUP_STATUS_ERROR_SELECTOR);

  if (
    !root ||
    !panel ||
    !content ||
    !loadingStatus ||
    !successStatus ||
    !errorStatus
  ) {
    try {
      await resolveSubmit();
      return true;
    } catch {
      return false;
    }
  }

  if (panel) {
    panel.classList.remove(
      MANUAL_SETUP_SUBMIT_FADE_CLASS,
      MANUAL_SETUP_SUBMIT_RESTORE_FADE_CLASS,
    );

    panel.querySelectorAll(MANUAL_SETUP_SUBMIT_FADE_SELECTORS).forEach((element) => {
      element.style.removeProperty("opacity");
      element.style.removeProperty("visibility");
      element.style.removeProperty("pointer-events");
    });

    animPhaseReset(content, ...MANUAL_SETUP_SUBMIT_CONTENT_PHASE_CLASSES);

    MANUAL_SETUP_SUBMIT_LAYOUT_VARS.forEach((layoutVar) => {
      content.style.removeProperty(layoutVar);
    });

    panel.classList.remove(MANUAL_SETUP_SUBMIT_RUNNING_CLASS);
    panel.style.removeProperty("position");
  }

  manualSetupStateSet({ isSubmitting: true });
  root.classList.toggle(MANUAL_SETUP_SUBMIT_LOCKED_CLASS, true);

  const submitPromise = (async () => {
    try {
      await resolveSubmit();
      return true;
    } catch {
      return false;
    }
  })();

  try {
    const panelRect = panel.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    const panelStyles = getComputedStyle(panel);
    const panelPaddingTop = Number.parseFloat(panelStyles.paddingTop) || 12;
    const layout = {
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

    const submitFadeMs = animCssMsGet(panel, MANUAL_SETUP_VAR_SUBMIT_FADE_MS);
    const expandUpMs = animCssMsGet(panel, MANUAL_SETUP_VAR_SUBMIT_EXPAND_UP_MS);
    const expandFullMs = animCssMsGet(panel, MANUAL_SETUP_VAR_SUBMIT_EXPAND_FULL_MS);
    const dotsFadeInMs = animCssMsGet(panel, MANUAL_SETUP_VAR_SUBMIT_DOTS_FADE_IN_MS);
    const dotsRunMs = animCssMsGet(panel, MANUAL_SETUP_VAR_SUBMIT_DOTS_RUN_MS);
    const dotsFadeOutMs = animCssMsGet(panel, MANUAL_SETUP_VAR_SUBMIT_DOTS_FADE_OUT_MS);
    const resultDrawMs = animCssMsGet(panel, MANUAL_SETUP_VAR_SUBMIT_RESULT_DRAW_MS);
    const resultFadeOutMs = animCssMsGet(panel, MANUAL_SETUP_VAR_SUBMIT_RESULT_FADE_OUT_MS);
    const shrinkFullMs = animCssMsGet(panel, MANUAL_SETUP_VAR_SUBMIT_SHRINK_FULL_MS);
    const timeoutBufferMs = animCssMsGet(panel, MANUAL_SETUP_VAR_ANIMATION_TIMEOUT_BUFFER_MS);
    const circleDuration = Math.round(resultDrawMs * 0.45);
    const markDuration = resultDrawMs - circleDuration;

    panel.classList.add(MANUAL_SETUP_SUBMIT_RUNNING_CLASS);
    panel.style.position = "relative";

    [loadingStatus, successStatus, errorStatus].forEach((status) => {
      if (!status) {
        return;
      }

      status.classList.add(MANUAL_SETUP_HIDDEN_CLASS);
      status.classList.remove(
        MANUAL_SETUP_SUBMIT_DOTS_FADE_IN_CLASS,
        MANUAL_SETUP_SUBMIT_DOTS_FADE_OUT_CLASS,
        MANUAL_SETUP_SUBMIT_DOTS_RUN_CLASS,
        MANUAL_SETUP_SUBMIT_RESULT_DRAW_CLASS,
        MANUAL_SETUP_SUBMIT_RESULT_FADE_OUT_CLASS,
        "is-animating",
        "is-drawn",
      );
    });

    panel.classList.add(MANUAL_SETUP_SUBMIT_FADE_CLASS);
    await animDelay(submitFadeMs);
    panel.classList.remove(MANUAL_SETUP_SUBMIT_FADE_CLASS);

    if (runId !== MANUAL_SETUP_SUBMIT_ANIMATION_RUN_ID.value) {
      return false;
    }

    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_ORIGIN_TOP, `${layout.originTop}px`);
    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_ORIGIN_LEFT, `${layout.originLeft}px`);
    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_ORIGIN_WIDTH, `${layout.originWidth}px`);
    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_ORIGIN_HEIGHT, `${layout.originHeight}px`);
    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_EXPAND_TOP, `${layout.expandUpTop}px`);
    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_EXPAND_LEFT, `${layout.expandUpLeft}px`);
    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_EXPAND_WIDTH, `${layout.expandUpWidth}px`);
    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_EXPAND_HEIGHT, `${layout.expandUpHeight}px`);
    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_FULL_TOP, `${layout.fullTop}px`);
    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_FULL_LEFT, `${layout.fullLeft}px`);
    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_FULL_WIDTH, `${layout.fullWidth}px`);
    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_FULL_HEIGHT, `${layout.fullHeight}px`);
    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_RESTORE_TOP, `${layout.originTop}px`);
    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_RESTORE_LEFT, `${layout.originLeft}px`);
    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_RESTORE_WIDTH, `${layout.originWidth}px`);
    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_RESTORE_HEIGHT, `${layout.originHeight}px`);
    content.classList.add(MANUAL_SETUP_SUBMIT_ABSOLUTE_CLASS);

    await animFrameWait();

    content.classList.add(MANUAL_SETUP_SUBMIT_EXPAND_UP_CLASS);
    await animAnimationEndWait(
      content,
      "signInExpandUp",
      expandUpMs + timeoutBufferMs,
    );
    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_ORIGIN_TOP, `${layout.expandUpTop}px`);
    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_ORIGIN_LEFT, `${layout.expandUpLeft}px`);
    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_ORIGIN_WIDTH, `${layout.expandUpWidth}px`);
    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_ORIGIN_HEIGHT, `${layout.expandUpHeight}px`);
    content.classList.remove(MANUAL_SETUP_SUBMIT_EXPAND_UP_CLASS);

    if (runId !== MANUAL_SETUP_SUBMIT_ANIMATION_RUN_ID.value) {
      return false;
    }

    await animFrameWait();

    content.classList.add(MANUAL_SETUP_SUBMIT_EXPAND_FULL_CLASS);
    await animAnimationEndWait(
      content,
      "signInExpandFull",
      expandFullMs + timeoutBufferMs,
    );
    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_ORIGIN_TOP, `${layout.fullTop}px`);
    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_ORIGIN_LEFT, `${layout.fullLeft}px`);
    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_ORIGIN_WIDTH, `${layout.fullWidth}px`);
    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_ORIGIN_HEIGHT, `${layout.fullHeight}px`);
    content.classList.remove(MANUAL_SETUP_SUBMIT_EXPAND_FULL_CLASS);

    if (runId !== MANUAL_SETUP_SUBMIT_ANIMATION_RUN_ID.value) {
      return false;
    }

    loadingStatus.classList.remove(MANUAL_SETUP_HIDDEN_CLASS);
    loadingStatus.classList.add(MANUAL_SETUP_SUBMIT_DOTS_FADE_IN_CLASS);
    await animAnimationEndWait(
      loadingStatus,
      "loginStatusFadeIn",
      dotsFadeInMs + timeoutBufferMs,
    );
    loadingStatus.classList.remove(MANUAL_SETUP_SUBMIT_DOTS_FADE_IN_CLASS);
    loadingStatus.classList.add(MANUAL_SETUP_SUBMIT_DOTS_RUN_CLASS);

    if (runId !== MANUAL_SETUP_SUBMIT_ANIMATION_RUN_ID.value) {
      return false;
    }

    const [, resultIsSuccess] = await Promise.all([
      animDelay(dotsRunMs),
      submitPromise,
    ]);

    if (runId !== MANUAL_SETUP_SUBMIT_ANIMATION_RUN_ID.value) {
      return false;
    }

    loadingStatus.classList.remove(MANUAL_SETUP_SUBMIT_DOTS_RUN_CLASS);
    loadingStatus.classList.add(MANUAL_SETUP_SUBMIT_DOTS_FADE_OUT_CLASS);
    await animAnimationEndWait(
      loadingStatus,
      "loginStatusFadeOut",
      dotsFadeOutMs + timeoutBufferMs,
    );
    loadingStatus.classList.remove(MANUAL_SETUP_SUBMIT_DOTS_FADE_OUT_CLASS);
    loadingStatus.classList.add(MANUAL_SETUP_HIDDEN_CLASS);

    if (runId !== MANUAL_SETUP_SUBMIT_ANIMATION_RUN_ID.value) {
      return false;
    }

    const resultStatus = resultIsSuccess ? successStatus : errorStatus;
    const circle = resultStatus.querySelector(MANUAL_SETUP_STATUS_ICON_CIRCLE_SELECTOR);
    const marks = [
      ...resultStatus.querySelectorAll(MANUAL_SETUP_STATUS_ICON_MARK_SELECTOR),
    ];

    resultStatus.classList.remove(MANUAL_SETUP_HIDDEN_CLASS);
    resultStatus.classList.add(MANUAL_SETUP_SUBMIT_RESULT_DRAW_CLASS, "is-animating");

    if (circle) {
      await animAnimationEndWait(
        circle,
        "loginStatusCircleDraw",
        circleDuration + timeoutBufferMs,
      );
    }

    if (runId !== MANUAL_SETUP_SUBMIT_ANIMATION_RUN_ID.value) {
      return false;
    }

    await Promise.all(
      marks.map((mark) =>
        animAnimationEndWait(mark, "loginStatusMarkDraw", markDuration + timeoutBufferMs),
      ),
    );

    if (runId !== MANUAL_SETUP_SUBMIT_ANIMATION_RUN_ID.value) {
      return false;
    }

    resultStatus.classList.remove("is-animating");
    resultStatus.classList.add("is-drawn");

    resultStatus.classList.add(MANUAL_SETUP_SUBMIT_RESULT_FADE_OUT_CLASS);
    await animAnimationEndWait(
      resultStatus,
      "loginStatusFadeOut",
      resultFadeOutMs + timeoutBufferMs,
    );
    resultStatus.classList.remove(
      MANUAL_SETUP_SUBMIT_RESULT_DRAW_CLASS,
      MANUAL_SETUP_SUBMIT_RESULT_FADE_OUT_CLASS,
      "is-drawn",
    );
    resultStatus.classList.add(MANUAL_SETUP_HIDDEN_CLASS);

    if (runId !== MANUAL_SETUP_SUBMIT_ANIMATION_RUN_ID.value) {
      return false;
    }

    content.classList.add(MANUAL_SETUP_SUBMIT_SHRINK_FULL_CLASS);
    await animAnimationEndWait(
      content,
      "signInShrinkFull",
      shrinkFullMs + timeoutBufferMs,
    );
    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_ORIGIN_TOP, `${layout.expandUpTop}px`);
    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_ORIGIN_LEFT, `${layout.expandUpLeft}px`);
    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_ORIGIN_WIDTH, `${layout.expandUpWidth}px`);
    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_ORIGIN_HEIGHT, `${layout.expandUpHeight}px`);
    content.classList.remove(MANUAL_SETUP_SUBMIT_SHRINK_FULL_CLASS);

    return resultIsSuccess;
  } finally {
    if (runId === MANUAL_SETUP_SUBMIT_ANIMATION_RUN_ID.value) {
      manualSetupStateSet({ isSubmitting: false });
      root.classList.toggle(MANUAL_SETUP_SUBMIT_LOCKED_CLASS, false);
    }
  }
}

export { manualSetupAnimationSubmit };
