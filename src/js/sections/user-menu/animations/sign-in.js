import { cssPhaseReset } from "../../../utils/utility-animation.js";
import { cssMs } from "../../../utils/utility-animation.js";
import { delay } from "../../../utils/utility-animation.js";
import { waitForAnimationEnd } from "../../../utils/utility-animation.js";
import { waitForNextFrame } from "../../../utils/utility-animation.js";
import { refreshAuth } from "../../../utils/utility-auth.js";
import { themeRead } from "../../../utils/utility-theme.js";
import { THEME_DARK } from "../../../utils/utility-theme.js";
import { userMenuStateGet } from "../state.js";
import { userMenuStateSet } from "../state.js";
import { USER_MENU_ACTIVE_CLASS } from "../constants.js";
import { USER_MENU_AUTH_BAR_SELECTOR } from "../constants.js";
import { USER_MENU_AUTH_BTN_SELECTOR } from "../constants.js";
import { USER_MENU_AUTH_SIGN_IN_CLASS } from "../constants.js";
import { USER_MENU_AUTH_SIGN_UP_CLASS } from "../constants.js";
import { USER_MENU_AUTH_TRACK_SELECTOR } from "../constants.js";
import { USER_MENU_AUTH_VIEW_SIGN_IN } from "../constants.js";
import { USER_MENU_AUTH_VIEW_SIGN_UP } from "../constants.js";
import { USER_MENU_CONTENT_SELECTOR } from "../constants.js";
import { USER_MENU_HEADER_SELECTOR } from "../constants.js";
import { USER_MENU_HIDDEN_CLASS } from "../constants.js";
import { USER_MENU_PANEL_SELECTOR } from "../constants.js";
import { USER_MENU_ROOT_SELECTOR } from "../constants.js";
import { USER_MENU_SIGN_IN_ABSOLUTE_CLASS } from "../constants.js";
import { USER_MENU_SIGN_IN_DOTS_FADE_IN_CLASS } from "../constants.js";
import { USER_MENU_SIGN_IN_DOTS_FADE_OUT_CLASS } from "../constants.js";
import { USER_MENU_SIGN_IN_DOTS_RUN_CLASS } from "../constants.js";
import { USER_MENU_SIGN_IN_FADE_CLASS } from "../constants.js";
import { USER_MENU_SIGN_IN_LOCKED_CLASS } from "../constants.js";
import { USER_MENU_SIGN_IN_RESTORE_FADE_CLASS } from "../constants.js";
import { USER_MENU_VAR_SIGN_IN_DOTS_FADE_IN_MS } from "../constants.js";
import { USER_MENU_VAR_SIGN_IN_DOTS_FADE_OUT_MS } from "../constants.js";
import { USER_MENU_VAR_SIGN_IN_DOTS_RUN_MS } from "../constants.js";
import { USER_MENU_VAR_SIGN_IN_EXPAND_FULL_MS } from "../constants.js";
import { USER_MENU_VAR_SIGN_IN_EXPAND_UP_MS } from "../constants.js";
import { USER_MENU_VAR_SIGN_IN_FADE_MS } from "../constants.js";
import { USER_MENU_SIGN_IN_EXPAND_FULL_CLASS } from "../constants.js";
import { USER_MENU_SIGN_IN_EXPAND_UP_CLASS } from "../constants.js";
import { USER_MENU_VAR_SIGN_IN_RESULT_DRAW_MS } from "../constants.js";
import { USER_MENU_VAR_SIGN_IN_RESULT_FADE_OUT_MS } from "../constants.js";
import { USER_MENU_SIGN_IN_RUNNING_CLASS } from "../constants.js";
import { USER_MENU_VAR_SIGN_IN_SHRINK_DOWN_MS } from "../constants.js";
import { USER_MENU_VAR_SIGN_IN_SHRINK_FULL_MS } from "../constants.js";
import { USER_MENU_SIGN_IN_SHRINK_DOWN_CLASS } from "../constants.js";
import { USER_MENU_SIGN_IN_SHRINK_FULL_CLASS } from "../constants.js";
import { USER_MENU_SIGN_IN_RESULT_DRAW_CLASS } from "../constants.js";
import { USER_MENU_SIGN_IN_RESULT_FADE_OUT_CLASS } from "../constants.js";
import { USER_MENU_VAR_SIGN_IN_RESTORE_FADE_MS } from "../constants.js";
import { USER_MENU_SIGNED_IN_VIEW_SELECTOR } from "../constants.js";
import { USER_MENU_SIGNED_OUT_VIEW_SELECTOR } from "../constants.js";
import { USER_MENU_SIGN_IN_INPUT_SELECTOR } from "../constants.js";
import { USER_MENU_SIGN_IN_VIEW_SELECTOR } from "../constants.js";
import { USER_MENU_SIGN_UP_VIEW_SELECTOR } from "../constants.js";
import { USER_MENU_THEME_BAR_SELECTOR } from "../constants.js";
import { USER_MENU_THEME_BTN_SELECTOR } from "../constants.js";
import { USER_MENU_THEME_DARK_CLASS } from "../constants.js";
import { USER_MENU_THEME_LIGHT_CLASS } from "../constants.js";
import { USER_MENU_THEME_TRACK_SELECTOR } from "../constants.js";
import { USER_MENU_STATUS_ERROR_SELECTOR } from "../constants.js";
import { USER_MENU_STATUS_ICON_CIRCLE_SELECTOR } from "../constants.js";
import { USER_MENU_STATUS_ICON_MARK_SELECTOR } from "../constants.js";
import { USER_MENU_STATUS_LOADING_SELECTOR } from "../constants.js";
import { USER_MENU_STATUS_SUCCESS_SELECTOR } from "../constants.js";
import { USER_MENU_VAR_ANIMATION_TIMEOUT_BUFFER_MS } from "../constants.js";
import { USER_MENU_SIGN_IN_FADE_SELECTORS } from "../constants.js";
import { USER_MENU_SIGN_IN_CONTENT_PHASE_CLASSES } from "../constants.js";
import { USER_MENU_SIGN_IN_LAYOUT_VARS } from "../constants.js";
import { USER_MENU_VAR_SIGN_IN_EXPAND_HEIGHT } from "../constants.js";
import { USER_MENU_VAR_SIGN_IN_EXPAND_LEFT } from "../constants.js";
import { USER_MENU_VAR_SIGN_IN_EXPAND_TOP } from "../constants.js";
import { USER_MENU_VAR_SIGN_IN_EXPAND_WIDTH } from "../constants.js";
import { USER_MENU_VAR_SIGN_IN_FULL_HEIGHT } from "../constants.js";
import { USER_MENU_VAR_SIGN_IN_FULL_LEFT } from "../constants.js";
import { USER_MENU_VAR_SIGN_IN_FULL_TOP } from "../constants.js";
import { USER_MENU_VAR_SIGN_IN_FULL_WIDTH } from "../constants.js";
import { USER_MENU_VAR_SIGN_IN_ORIGIN_HEIGHT } from "../constants.js";
import { USER_MENU_VAR_SIGN_IN_ORIGIN_LEFT } from "../constants.js";
import { USER_MENU_VAR_SIGN_IN_ORIGIN_TOP } from "../constants.js";
import { USER_MENU_VAR_SIGN_IN_ORIGIN_WIDTH } from "../constants.js";
import { USER_MENU_VAR_SIGN_IN_RESTORE_HEIGHT } from "../constants.js";
import { USER_MENU_VAR_SIGN_IN_RESTORE_LEFT } from "../constants.js";
import { USER_MENU_VAR_SIGN_IN_RESTORE_TOP } from "../constants.js";
import { USER_MENU_VAR_SIGN_IN_RESTORE_WIDTH } from "../constants.js";
import { USER_MENU_SIGN_IN_ANIMATION_RUN_ID } from "../constants.js";

export async function userMenuSignInAnimation(resultIsSuccess) {
  const isSignedInAfter = resultIsSuccess;
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
    if (isSignedInAfter || resultIsSuccess) {
      await refreshAuth();

      const input = document.querySelector(USER_MENU_SIGN_IN_INPUT_SELECTOR);

      if (input) {
        input.value = "";
      }
    }

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
      cssPhaseReset(content, ...USER_MENU_SIGN_IN_CONTENT_PHASE_CLASSES);

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
    const signInFadeMs = cssMs(panel,USER_MENU_VAR_SIGN_IN_FADE_MS);
    const expandUpMs = cssMs(panel,USER_MENU_VAR_SIGN_IN_EXPAND_UP_MS);
    const expandFullMs = cssMs(panel,USER_MENU_VAR_SIGN_IN_EXPAND_FULL_MS);
    const dotsFadeInMs = cssMs(panel,USER_MENU_VAR_SIGN_IN_DOTS_FADE_IN_MS);
    const dotsRunMs = cssMs(panel,USER_MENU_VAR_SIGN_IN_DOTS_RUN_MS);
    const dotsFadeOutMs = cssMs(panel,USER_MENU_VAR_SIGN_IN_DOTS_FADE_OUT_MS);
    const resultDrawMs = cssMs(panel,USER_MENU_VAR_SIGN_IN_RESULT_DRAW_MS);
    const resultFadeOutMs = cssMs(panel,USER_MENU_VAR_SIGN_IN_RESULT_FADE_OUT_MS);
    const shrinkFullMs = cssMs(panel,USER_MENU_VAR_SIGN_IN_SHRINK_FULL_MS);
    const shrinkDownMs = cssMs(panel,USER_MENU_VAR_SIGN_IN_SHRINK_DOWN_MS);
    const restoreFadeMs = cssMs(panel,USER_MENU_VAR_SIGN_IN_RESTORE_FADE_MS);
    const timeoutBufferMs = cssMs(panel, USER_MENU_VAR_ANIMATION_TIMEOUT_BUFFER_MS);
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
  await delay(signInFadeMs);
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

    await waitForNextFrame();

    content.classList.add(USER_MENU_SIGN_IN_EXPAND_UP_CLASS);
    await waitForAnimationEnd(
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

    await waitForNextFrame();

    content.classList.add(USER_MENU_SIGN_IN_EXPAND_FULL_CLASS);
    await waitForAnimationEnd(
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
    await waitForAnimationEnd(
      loadingStatus,
      "loginStatusFadeIn",
      dotsFadeInMs + timeoutBufferMs,
    );
    loadingStatus.classList.remove(USER_MENU_SIGN_IN_DOTS_FADE_IN_CLASS);
    loadingStatus.classList.add(USER_MENU_SIGN_IN_DOTS_RUN_CLASS);

    if (runId !== USER_MENU_SIGN_IN_ANIMATION_RUN_ID.value) {
      return false;
    }

    await delay(dotsRunMs);

    if (runId !== USER_MENU_SIGN_IN_ANIMATION_RUN_ID.value) {
      return false;
    }

    loadingStatus.classList.remove(USER_MENU_SIGN_IN_DOTS_RUN_CLASS);
    loadingStatus.classList.add(USER_MENU_SIGN_IN_DOTS_FADE_OUT_CLASS);
    await waitForAnimationEnd(
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
      await waitForAnimationEnd(
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
        waitForAnimationEnd(mark, "loginStatusMarkDraw", markDuration + timeoutBufferMs),
      ),
    );

    if (runId !== USER_MENU_SIGN_IN_ANIMATION_RUN_ID.value) {
      return false;
    }

    resultStatus.classList.remove("is-animating");
    resultStatus.classList.add("is-drawn");

    resultStatus.classList.add(USER_MENU_SIGN_IN_RESULT_FADE_OUT_CLASS);
    await waitForAnimationEnd(
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
    await waitForAnimationEnd(
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

    await waitForNextFrame();

    content.classList.add(USER_MENU_SIGN_IN_SHRINK_DOWN_CLASS);
    await waitForAnimationEnd(
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
      cssPhaseReset(content, ...USER_MENU_SIGN_IN_CONTENT_PHASE_CLASSES);

      USER_MENU_SIGN_IN_LAYOUT_VARS.forEach((layoutVar) => {
        content.style.removeProperty(layoutVar);
      });
    }

    panel.classList.remove(USER_MENU_SIGN_IN_RUNNING_CLASS);
    panel.style.removeProperty("position");
  }

    if (isSignedInAfter) {
      await refreshAuth();

      const input = document.querySelector(USER_MENU_SIGN_IN_INPUT_SELECTOR);

      if (input) {
        input.value = "";
      }

      const theme = themeRead();

      document.querySelectorAll(USER_MENU_THEME_BTN_SELECTOR).forEach((button) => {
        button.classList.toggle(USER_MENU_ACTIVE_CLASS, button.dataset.theme === theme);
      });

      const themeTrack = document.querySelector(USER_MENU_THEME_TRACK_SELECTOR);
      const isDark = theme === THEME_DARK;

      themeTrack?.classList.toggle(USER_MENU_THEME_LIGHT_CLASS, !isDark);
      themeTrack?.classList.toggle(USER_MENU_THEME_DARK_CLASS, isDark);
    } else if (resultIsSuccess) {
      await refreshAuth();

      const input = document.querySelector(USER_MENU_SIGN_IN_INPUT_SELECTOR);

      if (input) {
        input.value = "";
      }
    }

    const themeBar = document.querySelector(USER_MENU_THEME_BAR_SELECTOR);
    const signedInView = document.querySelector(USER_MENU_SIGNED_IN_VIEW_SELECTOR);

    authBar?.classList.toggle(USER_MENU_HIDDEN_CLASS, isSignedInAfter);
    themeBar?.classList.toggle(USER_MENU_HIDDEN_CLASS, !isSignedInAfter);
    signedOutView?.classList.toggle(USER_MENU_HIDDEN_CLASS, isSignedInAfter);
    signedInView?.classList.toggle(USER_MENU_HIDDEN_CLASS, !isSignedInAfter);

    if (!isSignedInAfter) {
      const authView = userMenuStateGet().authView || USER_MENU_AUTH_VIEW_SIGN_IN;
      const signInView = document.querySelector(USER_MENU_SIGN_IN_VIEW_SELECTOR);
      const signUpView = document.querySelector(USER_MENU_SIGN_UP_VIEW_SELECTOR);
      const isSignUp = authView === USER_MENU_AUTH_VIEW_SIGN_UP;

      signInView?.classList.toggle(USER_MENU_HIDDEN_CLASS, isSignUp);
      signUpView?.classList.toggle(USER_MENU_HIDDEN_CLASS, !isSignUp);

      document.querySelectorAll(USER_MENU_AUTH_BTN_SELECTOR).forEach((button) => {
        button.classList.toggle(
          USER_MENU_ACTIVE_CLASS,
          button.dataset.view === authView,
        );
      });

      const authTrack = document.querySelector(USER_MENU_AUTH_TRACK_SELECTOR);

      authTrack?.classList.toggle(USER_MENU_AUTH_SIGN_IN_CLASS, !isSignUp);
      authTrack?.classList.toggle(USER_MENU_AUTH_SIGN_UP_CLASS, isSignUp);
    }

    await waitForNextFrame();
    panel.classList.add(USER_MENU_SIGN_IN_RESTORE_FADE_CLASS);

    await waitForAnimationEnd(
      header,
      "userMenuRestoreFade",
      restoreFadeMs + timeoutBufferMs,
    );

    panel.classList.remove(USER_MENU_SIGN_IN_RESTORE_FADE_CLASS);
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
      cssPhaseReset(content, ...USER_MENU_SIGN_IN_CONTENT_PHASE_CLASSES);

      USER_MENU_SIGN_IN_LAYOUT_VARS.forEach((layoutVar) => {
        content.style.removeProperty(layoutVar);
      });
    }

    panel.classList.remove(USER_MENU_SIGN_IN_RUNNING_CLASS);
    panel.style.removeProperty("position");
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
