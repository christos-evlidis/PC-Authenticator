import { animAnimationEndWait } from "../../../../../utils/utility-animation.js";
import { animCssMsGet } from "../../../../../utils/utility-animation.js";
import { animDelay } from "../../../../../utils/utility-animation.js";
import { animFrameWait } from "../../../../../utils/utility-animation.js";
import { animPhaseReset } from "../../../../../utils/utility-animation.js";
import { userMenuStateSet } from "../../state/set.js";

import { USER_MENU_AUTH_BAR_SELECTOR } from "../../user-menu-const.js";
import { USER_MENU_CONTENT_SELECTOR } from "../../user-menu-const.js";
import { USER_MENU_HEADER_SELECTOR } from "../../user-menu-const.js";
import { USER_MENU_HIDDEN_CLASS } from "../../user-menu-const.js";
import { USER_MENU_PANEL_SELECTOR } from "../../user-menu-const.js";
import { USER_MENU_ROOT_SELECTOR } from "../../user-menu-const.js";
import { USER_MENU_SIGNED_OUT_VIEW_SELECTOR } from "../../user-menu-const.js";
import { USER_MENU_SIGN_IN_ABSOLUTE_CLASS } from "../../user-menu-const.js";
import { USER_MENU_SIGN_IN_ANIMATION_RUN_ID } from "../../user-menu-const.js";
import { USER_MENU_SIGN_IN_CONTENT_PHASE_CLASSES } from "../../user-menu-const.js";
import { USER_MENU_SIGN_IN_DOTS_FADE_IN_CLASS } from "../../user-menu-const.js";
import { USER_MENU_SIGN_IN_DOTS_FADE_OUT_CLASS } from "../../user-menu-const.js";
import { USER_MENU_SIGN_IN_DOTS_RUN_CLASS } from "../../user-menu-const.js";
import { USER_MENU_SIGN_IN_EXPAND_FULL_CLASS } from "../../user-menu-const.js";
import { USER_MENU_SIGN_IN_EXPAND_UP_CLASS } from "../../user-menu-const.js";
import { USER_MENU_SIGN_IN_FADE_CLASS } from "../../user-menu-const.js";
import { USER_MENU_SIGN_IN_FADE_SELECTORS } from "../../user-menu-const.js";
import { USER_MENU_SIGN_IN_LAYOUT_VARS } from "../../user-menu-const.js";
import { USER_MENU_SIGN_IN_LOCKED_CLASS } from "../../user-menu-const.js";
import { USER_MENU_SIGN_IN_RESTORE_FADE_CLASS } from "../../user-menu-const.js";
import { USER_MENU_SIGN_IN_RESULT_DRAW_CLASS } from "../../user-menu-const.js";
import { USER_MENU_SIGN_IN_RESULT_FADE_OUT_CLASS } from "../../user-menu-const.js";
import { USER_MENU_SIGN_IN_RUNNING_CLASS } from "../../user-menu-const.js";
import { USER_MENU_SIGN_IN_SHRINK_DOWN_CLASS } from "../../user-menu-const.js";
import { USER_MENU_SIGN_IN_SHRINK_FULL_CLASS } from "../../user-menu-const.js";
import { USER_MENU_STATUS_ERROR_SELECTOR } from "../../user-menu-const.js";
import { USER_MENU_STATUS_ICON_CIRCLE_SELECTOR } from "../../user-menu-const.js";
import { USER_MENU_STATUS_ICON_MARK_SELECTOR } from "../../user-menu-const.js";
import { USER_MENU_STATUS_LOADING_SELECTOR } from "../../user-menu-const.js";
import { USER_MENU_STATUS_SUCCESS_SELECTOR } from "../../user-menu-const.js";
import { USER_MENU_VAR_ANIMATION_TIMEOUT_BUFFER_MS } from "../../user-menu-const.js";
import { USER_MENU_VAR_SIGN_IN_DOTS_FADE_IN_MS } from "../../user-menu-const.js";
import { USER_MENU_VAR_SIGN_IN_DOTS_FADE_OUT_MS } from "../../user-menu-const.js";
import { USER_MENU_VAR_SIGN_IN_DOTS_RUN_MS } from "../../user-menu-const.js";
import { USER_MENU_VAR_SIGN_IN_EXPAND_FULL_MS } from "../../user-menu-const.js";
import { USER_MENU_VAR_SIGN_IN_EXPAND_HEIGHT } from "../../user-menu-const.js";
import { USER_MENU_VAR_SIGN_IN_EXPAND_LEFT } from "../../user-menu-const.js";
import { USER_MENU_VAR_SIGN_IN_EXPAND_TOP } from "../../user-menu-const.js";
import { USER_MENU_VAR_SIGN_IN_EXPAND_UP_MS } from "../../user-menu-const.js";
import { USER_MENU_VAR_SIGN_IN_EXPAND_WIDTH } from "../../user-menu-const.js";
import { USER_MENU_VAR_SIGN_IN_FADE_MS } from "../../user-menu-const.js";
import { USER_MENU_VAR_SIGN_IN_FULL_HEIGHT } from "../../user-menu-const.js";
import { USER_MENU_VAR_SIGN_IN_FULL_LEFT } from "../../user-menu-const.js";
import { USER_MENU_VAR_SIGN_IN_FULL_TOP } from "../../user-menu-const.js";
import { USER_MENU_VAR_SIGN_IN_FULL_WIDTH } from "../../user-menu-const.js";
import { USER_MENU_VAR_SIGN_IN_ORIGIN_HEIGHT } from "../../user-menu-const.js";
import { USER_MENU_VAR_SIGN_IN_ORIGIN_LEFT } from "../../user-menu-const.js";
import { USER_MENU_VAR_SIGN_IN_ORIGIN_TOP } from "../../user-menu-const.js";
import { USER_MENU_VAR_SIGN_IN_ORIGIN_WIDTH } from "../../user-menu-const.js";
import { USER_MENU_VAR_SIGN_IN_RESTORE_FADE_MS } from "../../user-menu-const.js";
import { USER_MENU_VAR_SIGN_IN_RESTORE_HEIGHT } from "../../user-menu-const.js";
import { USER_MENU_VAR_SIGN_IN_RESTORE_LEFT } from "../../user-menu-const.js";
import { USER_MENU_VAR_SIGN_IN_RESTORE_TOP } from "../../user-menu-const.js";
import { USER_MENU_VAR_SIGN_IN_RESTORE_WIDTH } from "../../user-menu-const.js";
import { USER_MENU_VAR_SIGN_IN_RESULT_DRAW_MS } from "../../user-menu-const.js";
import { USER_MENU_VAR_SIGN_IN_RESULT_FADE_OUT_MS } from "../../user-menu-const.js";
import { USER_MENU_VAR_SIGN_IN_SHRINK_DOWN_MS } from "../../user-menu-const.js";
import { USER_MENU_VAR_SIGN_IN_SHRINK_FULL_MS } from "../../user-menu-const.js";

async function userMenuAnimationAuthSignIn(resultIsSuccess, onPreRestore) {
  const runId = USER_MENU_SIGN_IN_ANIMATION_RUN_ID.value + 1;
  USER_MENU_SIGN_IN_ANIMATION_RUN_ID.value = runId;

  const panel = document.querySelector(USER_MENU_PANEL_SELECTOR);
  const header = document.querySelector(USER_MENU_HEADER_SELECTOR);
  const authBar = document.querySelector(USER_MENU_AUTH_BAR_SELECTOR);
  const content = document.querySelector(USER_MENU_CONTENT_SELECTOR);
  const signedOutView = document.querySelector(USER_MENU_SIGNED_OUT_VIEW_SELECTOR);
  const loadingStatus = document.querySelector(USER_MENU_STATUS_LOADING_SELECTOR);
  const successStatus = document.querySelector(USER_MENU_STATUS_SUCCESS_SELECTOR);
  const errorStatus = document.querySelector(USER_MENU_STATUS_ERROR_SELECTOR);

  if (
    !panel ||
    !header ||
    !authBar ||
    !content ||
    !signedOutView ||
    !loadingStatus ||
    !successStatus ||
    !errorStatus
  ) {
    return resultIsSuccess;
  }

  if (panel) {
    panel.classList.remove(
      USER_MENU_SIGN_IN_FADE_CLASS,
      USER_MENU_SIGN_IN_RESTORE_FADE_CLASS,
    );

    panel.querySelectorAll(USER_MENU_SIGN_IN_FADE_SELECTORS).forEach((element) => {
      element.style.removeProperty("opacity");
      element.style.removeProperty("visibility");
      element.style.removeProperty("pointer-events");
    });

    if (content) {
      animPhaseReset(content, ...USER_MENU_SIGN_IN_CONTENT_PHASE_CLASSES);

      USER_MENU_SIGN_IN_LAYOUT_VARS.forEach((layoutVar) => {
        content.style.removeProperty(layoutVar);
      });
    }

    panel.classList.remove(USER_MENU_SIGN_IN_RUNNING_CLASS);
    panel.style.removeProperty("position");
  }

  userMenuStateSet({ isSignInRunning: true });
  document
    .querySelector(USER_MENU_ROOT_SELECTOR)
    ?.classList.toggle(USER_MENU_SIGN_IN_LOCKED_CLASS, true);

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
    const signInFadeMs = animCssMsGet(panel,USER_MENU_VAR_SIGN_IN_FADE_MS);
    const expandUpMs = animCssMsGet(panel,USER_MENU_VAR_SIGN_IN_EXPAND_UP_MS);
    const expandFullMs = animCssMsGet(panel,USER_MENU_VAR_SIGN_IN_EXPAND_FULL_MS);
    const dotsFadeInMs = animCssMsGet(panel,USER_MENU_VAR_SIGN_IN_DOTS_FADE_IN_MS);
    const dotsRunMs = animCssMsGet(panel,USER_MENU_VAR_SIGN_IN_DOTS_RUN_MS);
    const dotsFadeOutMs = animCssMsGet(panel,USER_MENU_VAR_SIGN_IN_DOTS_FADE_OUT_MS);
    const resultDrawMs = animCssMsGet(panel,USER_MENU_VAR_SIGN_IN_RESULT_DRAW_MS);
    const resultFadeOutMs = animCssMsGet(panel,USER_MENU_VAR_SIGN_IN_RESULT_FADE_OUT_MS);
    const shrinkFullMs = animCssMsGet(panel,USER_MENU_VAR_SIGN_IN_SHRINK_FULL_MS);
    const shrinkDownMs = animCssMsGet(panel,USER_MENU_VAR_SIGN_IN_SHRINK_DOWN_MS);
    const restoreFadeMs = animCssMsGet(panel,USER_MENU_VAR_SIGN_IN_RESTORE_FADE_MS);
    const timeoutBufferMs = animCssMsGet(panel, USER_MENU_VAR_ANIMATION_TIMEOUT_BUFFER_MS);
    const circleDuration = Math.round(resultDrawMs * 0.45);
    const markDuration = resultDrawMs - circleDuration;

    panel.classList.add(USER_MENU_SIGN_IN_RUNNING_CLASS);
    panel.style.position = "relative";
    [loadingStatus, successStatus, errorStatus].forEach((status) => {
    if (!status) {
      return;
    }

    status.classList.add(USER_MENU_HIDDEN_CLASS);
    status.classList.remove(
      USER_MENU_SIGN_IN_DOTS_FADE_IN_CLASS,
      USER_MENU_SIGN_IN_DOTS_FADE_OUT_CLASS,
      USER_MENU_SIGN_IN_DOTS_RUN_CLASS,
      USER_MENU_SIGN_IN_RESULT_DRAW_CLASS,
      USER_MENU_SIGN_IN_RESULT_FADE_OUT_CLASS,
      "is-animating",
      "is-drawn",
    );
  });

    panel.classList.add(USER_MENU_SIGN_IN_FADE_CLASS);
    await animDelay(signInFadeMs);
    panel.classList.remove(USER_MENU_SIGN_IN_FADE_CLASS);

    if (runId !== USER_MENU_SIGN_IN_ANIMATION_RUN_ID.value) {
      return false;
    }

    content.style.setProperty(USER_MENU_VAR_SIGN_IN_ORIGIN_TOP, `${layout.originTop}px`);
  content.style.setProperty(USER_MENU_VAR_SIGN_IN_ORIGIN_LEFT, `${layout.originLeft}px`);
  content.style.setProperty(USER_MENU_VAR_SIGN_IN_ORIGIN_WIDTH, `${layout.originWidth}px`);
  content.style.setProperty(USER_MENU_VAR_SIGN_IN_ORIGIN_HEIGHT, `${layout.originHeight}px`);
  content.style.setProperty(USER_MENU_VAR_SIGN_IN_EXPAND_TOP, `${layout.expandUpTop}px`);
  content.style.setProperty(USER_MENU_VAR_SIGN_IN_EXPAND_LEFT, `${layout.expandUpLeft}px`);
  content.style.setProperty(USER_MENU_VAR_SIGN_IN_EXPAND_WIDTH, `${layout.expandUpWidth}px`);
  content.style.setProperty(USER_MENU_VAR_SIGN_IN_EXPAND_HEIGHT, `${layout.expandUpHeight}px`);
  content.style.setProperty(USER_MENU_VAR_SIGN_IN_FULL_TOP, `${layout.fullTop}px`);
  content.style.setProperty(USER_MENU_VAR_SIGN_IN_FULL_LEFT, `${layout.fullLeft}px`);
  content.style.setProperty(USER_MENU_VAR_SIGN_IN_FULL_WIDTH, `${layout.fullWidth}px`);
  content.style.setProperty(USER_MENU_VAR_SIGN_IN_FULL_HEIGHT, `${layout.fullHeight}px`);
  content.style.setProperty(USER_MENU_VAR_SIGN_IN_RESTORE_TOP, `${layout.originTop}px`);
  content.style.setProperty(USER_MENU_VAR_SIGN_IN_RESTORE_LEFT, `${layout.originLeft}px`);
  content.style.setProperty(USER_MENU_VAR_SIGN_IN_RESTORE_WIDTH, `${layout.originWidth}px`);
  content.style.setProperty(USER_MENU_VAR_SIGN_IN_RESTORE_HEIGHT, `${layout.originHeight}px`);
    content.classList.add(USER_MENU_SIGN_IN_ABSOLUTE_CLASS);

    await animFrameWait();

    content.classList.add(USER_MENU_SIGN_IN_EXPAND_UP_CLASS);
    await animAnimationEndWait(
      content,
      "signInExpandUp",
      expandUpMs + timeoutBufferMs,
    );
    content.style.setProperty(USER_MENU_VAR_SIGN_IN_ORIGIN_TOP, `${layout.expandUpTop}px`);
    content.style.setProperty(USER_MENU_VAR_SIGN_IN_ORIGIN_LEFT, `${layout.expandUpLeft}px`);
    content.style.setProperty(USER_MENU_VAR_SIGN_IN_ORIGIN_WIDTH, `${layout.expandUpWidth}px`);
    content.style.setProperty(USER_MENU_VAR_SIGN_IN_ORIGIN_HEIGHT, `${layout.expandUpHeight}px`);
    content.classList.remove(USER_MENU_SIGN_IN_EXPAND_UP_CLASS);

    if (runId !== USER_MENU_SIGN_IN_ANIMATION_RUN_ID.value) {
      return false;
    }

    await animFrameWait();

    content.classList.add(USER_MENU_SIGN_IN_EXPAND_FULL_CLASS);
    await animAnimationEndWait(
      content,
      "signInExpandFull",
      expandFullMs + timeoutBufferMs,
    );
    content.style.setProperty(USER_MENU_VAR_SIGN_IN_ORIGIN_TOP, `${layout.fullTop}px`);
    content.style.setProperty(USER_MENU_VAR_SIGN_IN_ORIGIN_LEFT, `${layout.fullLeft}px`);
    content.style.setProperty(USER_MENU_VAR_SIGN_IN_ORIGIN_WIDTH, `${layout.fullWidth}px`);
    content.style.setProperty(USER_MENU_VAR_SIGN_IN_ORIGIN_HEIGHT, `${layout.fullHeight}px`);
    content.classList.remove(USER_MENU_SIGN_IN_EXPAND_FULL_CLASS);

    if (runId !== USER_MENU_SIGN_IN_ANIMATION_RUN_ID.value) {
      return false;
    }

    loadingStatus.classList.remove(USER_MENU_HIDDEN_CLASS);
    loadingStatus.classList.add(USER_MENU_SIGN_IN_DOTS_FADE_IN_CLASS);
    await animAnimationEndWait(
      loadingStatus,
      "loginStatusFadeIn",
      dotsFadeInMs + timeoutBufferMs,
    );
    loadingStatus.classList.remove(USER_MENU_SIGN_IN_DOTS_FADE_IN_CLASS);
    loadingStatus.classList.add(USER_MENU_SIGN_IN_DOTS_RUN_CLASS);

    if (runId !== USER_MENU_SIGN_IN_ANIMATION_RUN_ID.value) {
      return false;
    }

    await animDelay(dotsRunMs);

    if (runId !== USER_MENU_SIGN_IN_ANIMATION_RUN_ID.value) {
      return false;
    }

    loadingStatus.classList.remove(USER_MENU_SIGN_IN_DOTS_RUN_CLASS);
    loadingStatus.classList.add(USER_MENU_SIGN_IN_DOTS_FADE_OUT_CLASS);
    await animAnimationEndWait(
      loadingStatus,
      "loginStatusFadeOut",
      dotsFadeOutMs + timeoutBufferMs,
    );
    loadingStatus.classList.remove(USER_MENU_SIGN_IN_DOTS_FADE_OUT_CLASS);
    loadingStatus.classList.add(USER_MENU_HIDDEN_CLASS);

    if (runId !== USER_MENU_SIGN_IN_ANIMATION_RUN_ID.value) {
      return false;
    }

    const resultStatus = resultIsSuccess ? successStatus : errorStatus;
    const circle = resultStatus.querySelector(USER_MENU_STATUS_ICON_CIRCLE_SELECTOR);
    const marks = [
      ...resultStatus.querySelectorAll(USER_MENU_STATUS_ICON_MARK_SELECTOR),
    ];

    resultStatus.classList.remove(USER_MENU_HIDDEN_CLASS);
    resultStatus.classList.add(USER_MENU_SIGN_IN_RESULT_DRAW_CLASS, "is-animating");

    if (circle) {
      await animAnimationEndWait(
        circle,
        "loginStatusCircleDraw",
        circleDuration + timeoutBufferMs,
      );
    }

    if (runId !== USER_MENU_SIGN_IN_ANIMATION_RUN_ID.value) {
      return false;
    }

    await Promise.all(
      marks.map((mark) =>
        animAnimationEndWait(mark, "loginStatusMarkDraw", markDuration + timeoutBufferMs),
      ),
    );

    if (runId !== USER_MENU_SIGN_IN_ANIMATION_RUN_ID.value) {
      return false;
    }

    resultStatus.classList.remove("is-animating");
    resultStatus.classList.add("is-drawn");

    resultStatus.classList.add(USER_MENU_SIGN_IN_RESULT_FADE_OUT_CLASS);
    await animAnimationEndWait(
      resultStatus,
      "loginStatusFadeOut",
      resultFadeOutMs + timeoutBufferMs,
    );
    resultStatus.classList.remove(
      USER_MENU_SIGN_IN_RESULT_DRAW_CLASS,
      USER_MENU_SIGN_IN_RESULT_FADE_OUT_CLASS,
      "is-drawn",
    );
    resultStatus.classList.add(USER_MENU_HIDDEN_CLASS);
    if (runId !== USER_MENU_SIGN_IN_ANIMATION_RUN_ID.value) {
      return false;
    }

    content.classList.add(USER_MENU_SIGN_IN_SHRINK_FULL_CLASS);
    await animAnimationEndWait(
      content,
      "signInShrinkFull",
      shrinkFullMs + timeoutBufferMs,
    );
    content.style.setProperty(USER_MENU_VAR_SIGN_IN_ORIGIN_TOP, `${layout.expandUpTop}px`);
    content.style.setProperty(USER_MENU_VAR_SIGN_IN_ORIGIN_LEFT, `${layout.expandUpLeft}px`);
    content.style.setProperty(USER_MENU_VAR_SIGN_IN_ORIGIN_WIDTH, `${layout.expandUpWidth}px`);
    content.style.setProperty(USER_MENU_VAR_SIGN_IN_ORIGIN_HEIGHT, `${layout.expandUpHeight}px`);
    content.classList.remove(USER_MENU_SIGN_IN_SHRINK_FULL_CLASS);

    if (runId !== USER_MENU_SIGN_IN_ANIMATION_RUN_ID.value) {
      return false;
    }

    await animFrameWait();

    content.classList.add(USER_MENU_SIGN_IN_SHRINK_DOWN_CLASS);
    await animAnimationEndWait(
      content,
      "signInShrinkDown",
      shrinkDownMs + timeoutBufferMs,
    );
    content.style.setProperty(USER_MENU_VAR_SIGN_IN_ORIGIN_TOP, `${layout.originTop}px`);
    content.style.setProperty(USER_MENU_VAR_SIGN_IN_ORIGIN_LEFT, `${layout.originLeft}px`);
    content.style.setProperty(USER_MENU_VAR_SIGN_IN_ORIGIN_WIDTH, `${layout.originWidth}px`);
    content.style.setProperty(USER_MENU_VAR_SIGN_IN_ORIGIN_HEIGHT, `${layout.originHeight}px`);
    content.classList.remove(USER_MENU_SIGN_IN_SHRINK_DOWN_CLASS);

    if (runId !== USER_MENU_SIGN_IN_ANIMATION_RUN_ID.value) {
      return false;
    }

    if (content) {
      animPhaseReset(content, ...USER_MENU_SIGN_IN_CONTENT_PHASE_CLASSES);

      USER_MENU_SIGN_IN_LAYOUT_VARS.forEach((layoutVar) => {
        content.style.removeProperty(layoutVar);
      });
    }

    let extensionFades = [];
    let afterFades = null;

    if (onPreRestore) {
      const restoreResult = await onPreRestore(resultIsSuccess);

      if (Array.isArray(restoreResult)) {
        extensionFades = restoreResult;
      } else {
        extensionFades = restoreResult?.extensionFades ?? [];
        afterFades = restoreResult?.afterFades ?? null;
      }
    }

    await animFrameWait();
    panel.classList.add(USER_MENU_SIGN_IN_RESTORE_FADE_CLASS);

    await Promise.all([
      ...extensionFades,
      animAnimationEndWait(
        header,
        "userMenuRestoreFade",
        restoreFadeMs + timeoutBufferMs,
      ),
    ]);

    if (afterFades) {
      await afterFades();
    }

    if (panel) {
      panel.classList.remove(
        USER_MENU_SIGN_IN_FADE_CLASS,
        USER_MENU_SIGN_IN_RESTORE_FADE_CLASS,
        USER_MENU_SIGN_IN_RUNNING_CLASS,
      );
      panel.style.removeProperty("position");

      panel.querySelectorAll(USER_MENU_SIGN_IN_FADE_SELECTORS).forEach((element) => {
        element.style.removeProperty("opacity");
        element.style.removeProperty("visibility");
        element.style.removeProperty("pointer-events");
      });
    }

    return resultIsSuccess;
  } finally {
    if (runId === USER_MENU_SIGN_IN_ANIMATION_RUN_ID.value) {
      userMenuStateSet({ isSignInRunning: false });
      document
        .querySelector(USER_MENU_ROOT_SELECTOR)
        ?.classList.toggle(USER_MENU_SIGN_IN_LOCKED_CLASS, false);
    }
  }
}

export { userMenuAnimationAuthSignIn };
