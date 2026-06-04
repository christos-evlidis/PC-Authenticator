import { cssPhaseReset } from "../../../utils/utility-animation.js";
import { cssMs } from "../../../utils/utility-animation.js";
import { delay } from "../../../utils/utility-animation.js";
import { waitForAnimationEnd } from "../../../utils/utility-animation.js";
import { waitForNextFrame } from "../../../utils/utility-animation.js";
import { waitForTransitionEnd } from "../../../utils/utility-animation.js";
import { refreshAuth } from "../../../utils/utility-auth.js";
import { themeRead } from "../../../utils/utility-theme.js";
import { userMenuStateGet } from "../user-menu-state.js";
import { userMenuStateSet } from "../user-menu-state.js";
import { userMenuAuthViewApply } from "../user-menu-render/user-menu-auth.js";
import { userMenuAuthTrackApply } from "../user-menu-render/user-menu-auth.js";
import { userMenuSignInInputClear } from "../user-menu-render/user-menu-auth.js";
import { userMenuThemeButtonsApply } from "../user-menu-render/user-menu-theme.js";
import { userMenuThemeTrackApply } from "../user-menu-render/user-menu-theme.js";
import { userMenuViewsApply } from "../user-menu-render/user-menu-views.js";
import { USER_MENU_AUTH_BAR_SELECTOR } from "../user-menu-constants.js";
import { USER_MENU_AUTH_VIEW_SIGN_IN } from "../user-menu-constants.js";
import { USER_MENU_CONTENT_SELECTOR } from "../user-menu-constants.js";
import { USER_MENU_HEADER_SELECTOR } from "../user-menu-constants.js";
import { USER_MENU_HIDDEN_CLASS } from "../user-menu-constants.js";
import { USER_MENU_PANEL_SELECTOR } from "../user-menu-constants.js";
import { USER_MENU_ROOT_SELECTOR } from "../user-menu-constants.js";
import { USER_MENU_SIGN_OUT_ABSOLUTE_CLASS } from "../user-menu-constants.js";
import { USER_MENU_SIGN_OUT_CHROME_HIDDEN_CLASS } from "../user-menu-constants.js";
import { USER_MENU_SIGN_OUT_CHROME_PREPARING_CLASS } from "../user-menu-constants.js";
import { USER_MENU_SIGN_OUT_CHROME_VISIBLE_CLASS } from "../user-menu-constants.js";
import { USER_MENU_VAR_SIGN_OUT_DOTS_FADE_IN_MS } from "../user-menu-constants.js";
import { USER_MENU_VAR_SIGN_OUT_DOTS_FADE_OUT_MS } from "../user-menu-constants.js";
import { USER_MENU_VAR_SIGN_OUT_DOTS_RUN_MS } from "../user-menu-constants.js";
import { USER_MENU_VAR_SIGN_OUT_EXPAND_FULL_MS } from "../user-menu-constants.js";
import { USER_MENU_VAR_SIGN_OUT_EXPAND_UP_MS } from "../user-menu-constants.js";
import { USER_MENU_VAR_SIGN_OUT_FADE_MS } from "../user-menu-constants.js";
import { USER_MENU_SIGN_OUT_FADING_CHROME_CLASS } from "../user-menu-constants.js";
import { USER_MENU_SIGN_OUT_LOCKED_CLASS } from "../user-menu-constants.js";
import { USER_MENU_SIGN_OUT_PHASE_EXPAND_FULL_CLASS } from "../user-menu-constants.js";
import { USER_MENU_SIGN_OUT_PHASE_EXPAND_UP_CLASS } from "../user-menu-constants.js";
import { USER_MENU_SIGN_OUT_PHASE_SHRINK_ORIGIN_CLASS } from "../user-menu-constants.js";
import { USER_MENU_SIGN_OUT_PHASE_SHRINK_PADDING_CLASS } from "../user-menu-constants.js";
import { USER_MENU_VAR_SIGN_OUT_RESTORE_FADE_MS } from "../user-menu-constants.js";
import { USER_MENU_SIGN_OUT_RESULT_DRAW_CLASS } from "../user-menu-constants.js";
import { USER_MENU_SIGN_OUT_RESULT_HIDE_CLASS } from "../user-menu-constants.js";
import { USER_MENU_VAR_SIGN_OUT_RESULT_DRAW_MS } from "../user-menu-constants.js";
import { USER_MENU_VAR_SIGN_OUT_RESULT_FADE_OUT_MS } from "../user-menu-constants.js";
import { USER_MENU_SIGN_OUT_RUNNING_CLASS } from "../user-menu-constants.js";
import { USER_MENU_VAR_SIGN_OUT_SHRINK_ORIGIN_MS } from "../user-menu-constants.js";
import { USER_MENU_VAR_SIGN_OUT_SHRINK_PADDING_MS } from "../user-menu-constants.js";
import { USER_MENU_SIGN_OUT_STATUS_LOADING_IN_CLASS } from "../user-menu-constants.js";
import { USER_MENU_SIGN_OUT_STATUS_LOADING_OUT_CLASS } from "../user-menu-constants.js";
import { USER_MENU_SIGNED_OUT_VIEW_SELECTOR } from "../user-menu-constants.js";
import { USER_MENU_STATUS_ERROR_SELECTOR } from "../user-menu-constants.js";
import { USER_MENU_STATUS_ICON_CIRCLE_SELECTOR } from "../user-menu-constants.js";
import { USER_MENU_STATUS_ICON_MARK_SELECTOR } from "../user-menu-constants.js";
import { USER_MENU_STATUS_LOADING_SELECTOR } from "../user-menu-constants.js";
import { USER_MENU_STATUS_SUCCESS_SELECTOR } from "../user-menu-constants.js";
import { USER_MENU_ANIMATION_TIMEOUT_BUFFER_MS } from "../user-menu-constants.js";
import { USER_MENU_SIGN_OUT_CHROME_SELECTORS } from "../user-menu-constants.js";
import { USER_MENU_SIGN_OUT_CONTENT_PHASE_CLASSES } from "../user-menu-constants.js";
import { USER_MENU_SIGN_OUT_LAYOUT_VARS } from "../user-menu-constants.js";
import { USER_MENU_VAR_SIGN_OUT_EXPAND_HEIGHT } from "../user-menu-constants.js";
import { USER_MENU_VAR_SIGN_OUT_EXPAND_LEFT } from "../user-menu-constants.js";
import { USER_MENU_VAR_SIGN_OUT_EXPAND_TOP } from "../user-menu-constants.js";
import { USER_MENU_VAR_SIGN_OUT_EXPAND_WIDTH } from "../user-menu-constants.js";
import { USER_MENU_VAR_SIGN_OUT_FULL_HEIGHT } from "../user-menu-constants.js";
import { USER_MENU_VAR_SIGN_OUT_FULL_LEFT } from "../user-menu-constants.js";
import { USER_MENU_VAR_SIGN_OUT_FULL_TOP } from "../user-menu-constants.js";
import { USER_MENU_VAR_SIGN_OUT_FULL_WIDTH } from "../user-menu-constants.js";
import { USER_MENU_VAR_SIGN_OUT_ORIGIN_HEIGHT } from "../user-menu-constants.js";
import { USER_MENU_VAR_SIGN_OUT_ORIGIN_LEFT } from "../user-menu-constants.js";
import { USER_MENU_VAR_SIGN_OUT_ORIGIN_TOP } from "../user-menu-constants.js";
import { USER_MENU_VAR_SIGN_OUT_ORIGIN_WIDTH } from "../user-menu-constants.js";
import { USER_MENU_VAR_SIGN_OUT_RESTORE_HEIGHT } from "../user-menu-constants.js";
import { USER_MENU_VAR_SIGN_OUT_RESTORE_LEFT } from "../user-menu-constants.js";
import { USER_MENU_VAR_SIGN_OUT_RESTORE_TOP } from "../user-menu-constants.js";
import { USER_MENU_VAR_SIGN_OUT_RESTORE_WIDTH } from "../user-menu-constants.js";
import { USER_MENU_SIGN_OUT_ANIMATION_RUN_ID } from "../user-menu-constants.js";

export async function userMenuSignOutAnimation() {
  const resultIsSuccess = true;
  const isSignedInAfter = false;
  const runId = USER_MENU_SIGN_OUT_ANIMATION_RUN_ID.value + 1;
  USER_MENU_SIGN_OUT_ANIMATION_RUN_ID.value = runId;

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
      userMenuSignInInputClear();
    }

    return resultIsSuccess;
  }

  if (panel) {
    panel.classList.remove(
      USER_MENU_SIGN_OUT_FADING_CHROME_CLASS,
      USER_MENU_SIGN_OUT_CHROME_HIDDEN_CLASS,
      USER_MENU_SIGN_OUT_CHROME_PREPARING_CLASS,
      USER_MENU_SIGN_OUT_CHROME_VISIBLE_CLASS,
    );

    panel.querySelectorAll(USER_MENU_SIGN_OUT_CHROME_SELECTORS).forEach((element) => {
      element.style.removeProperty("opacity");
      element.style.removeProperty("visibility");
      element.style.removeProperty("pointer-events");
    });

    if (content) {
      cssPhaseReset(content, ...USER_MENU_SIGN_OUT_CONTENT_PHASE_CLASSES);

      USER_MENU_SIGN_OUT_LAYOUT_VARS.forEach((layoutVar) => {
        content.style.removeProperty(layoutVar);
      });
    }

    panel.classList.remove(USER_MENU_SIGN_OUT_RUNNING_CLASS);
    panel.style.removeProperty("position");
  }
  userMenuStateSet({ isSignInRunning: true });
  document
    .querySelector(USER_MENU_ROOT_SELECTOR)
    ?.classList.toggle(USER_MENU_SIGN_OUT_LOCKED_CLASS, true);

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
    const signOutFadeMs = cssMs(panel,USER_MENU_VAR_SIGN_OUT_FADE_MS);
    const expandUpMs = cssMs(panel,USER_MENU_VAR_SIGN_OUT_EXPAND_UP_MS);
    const expandFullMs = cssMs(panel,USER_MENU_VAR_SIGN_OUT_EXPAND_FULL_MS);
    const dotsFadeInMs = cssMs(panel,USER_MENU_VAR_SIGN_OUT_DOTS_FADE_IN_MS);
    const dotsRunMs = cssMs(panel,USER_MENU_VAR_SIGN_OUT_DOTS_RUN_MS);
    const dotsFadeOutMs = cssMs(panel,USER_MENU_VAR_SIGN_OUT_DOTS_FADE_OUT_MS);
    const resultDrawMs = cssMs(panel,USER_MENU_VAR_SIGN_OUT_RESULT_DRAW_MS);
    const resultFadeOutMs = cssMs(panel,USER_MENU_VAR_SIGN_OUT_RESULT_FADE_OUT_MS);
    const shrinkPaddingMs = cssMs(panel,USER_MENU_VAR_SIGN_OUT_SHRINK_PADDING_MS);
    const shrinkOriginMs = cssMs(panel,USER_MENU_VAR_SIGN_OUT_SHRINK_ORIGIN_MS);
    const restoreFadeMs = cssMs(panel,USER_MENU_VAR_SIGN_OUT_RESTORE_FADE_MS);
    const circleDuration = Math.round(resultDrawMs * 0.45);
    const markDuration = resultDrawMs - circleDuration;

    panel.classList.add(USER_MENU_SIGN_OUT_RUNNING_CLASS);
    panel.style.position = "relative";
    [loadingStatus, successStatus, errorStatus].forEach((status) => {
    if (!status) {
      return;
    }

    status.classList.add(USER_MENU_HIDDEN_CLASS);
    status.classList.remove(
      USER_MENU_SIGN_OUT_STATUS_LOADING_IN_CLASS,
      USER_MENU_SIGN_OUT_STATUS_LOADING_OUT_CLASS,
      "is-shown",
      USER_MENU_SIGN_OUT_RESULT_DRAW_CLASS,
      USER_MENU_SIGN_OUT_RESULT_HIDE_CLASS,
      "is-animating",
      "is-drawn",
    );
  });

    panel.classList.add(USER_MENU_SIGN_OUT_FADING_CHROME_CLASS);
  await delay(signOutFadeMs);
  panel.classList.remove(USER_MENU_SIGN_OUT_FADING_CHROME_CLASS);
  panel.classList.add(USER_MENU_SIGN_OUT_CHROME_HIDDEN_CLASS);

    if (runId !== USER_MENU_SIGN_OUT_ANIMATION_RUN_ID.value) {
      return false;
    }

    content.style.setProperty(USER_MENU_VAR_SIGN_OUT_ORIGIN_TOP, `${layout.originTop}px`);
  content.style.setProperty(USER_MENU_VAR_SIGN_OUT_ORIGIN_LEFT, `${layout.originLeft}px`);
  content.style.setProperty(USER_MENU_VAR_SIGN_OUT_ORIGIN_WIDTH, `${layout.originWidth}px`);
  content.style.setProperty(USER_MENU_VAR_SIGN_OUT_ORIGIN_HEIGHT, `${layout.originHeight}px`);
  content.style.setProperty(USER_MENU_VAR_SIGN_OUT_EXPAND_TOP, `${layout.expandUpTop}px`);
  content.style.setProperty(USER_MENU_VAR_SIGN_OUT_EXPAND_LEFT, `${layout.expandUpLeft}px`);
  content.style.setProperty(USER_MENU_VAR_SIGN_OUT_EXPAND_WIDTH, `${layout.expandUpWidth}px`);
  content.style.setProperty(USER_MENU_VAR_SIGN_OUT_EXPAND_HEIGHT, `${layout.expandUpHeight}px`);
  content.style.setProperty(USER_MENU_VAR_SIGN_OUT_FULL_TOP, `${layout.fullTop}px`);
  content.style.setProperty(USER_MENU_VAR_SIGN_OUT_FULL_LEFT, `${layout.fullLeft}px`);
  content.style.setProperty(USER_MENU_VAR_SIGN_OUT_FULL_WIDTH, `${layout.fullWidth}px`);
  content.style.setProperty(USER_MENU_VAR_SIGN_OUT_FULL_HEIGHT, `${layout.fullHeight}px`);
  content.style.setProperty(USER_MENU_VAR_SIGN_OUT_RESTORE_TOP, `${layout.originTop}px`);
  content.style.setProperty(USER_MENU_VAR_SIGN_OUT_RESTORE_LEFT, `${layout.originLeft}px`);
  content.style.setProperty(USER_MENU_VAR_SIGN_OUT_RESTORE_WIDTH, `${layout.originWidth}px`);
  content.style.setProperty(USER_MENU_VAR_SIGN_OUT_RESTORE_HEIGHT, `${layout.originHeight}px`);
    content.classList.add(USER_MENU_SIGN_OUT_ABSOLUTE_CLASS);

    await waitForNextFrame();

    content.classList.add(USER_MENU_SIGN_OUT_PHASE_EXPAND_UP_CLASS);
    await waitForAnimationEnd(
      content,
      "signInExpandUp",
      expandUpMs + USER_MENU_ANIMATION_TIMEOUT_BUFFER_MS,
    );
    content.style.setProperty(USER_MENU_VAR_SIGN_OUT_ORIGIN_TOP, `${layout.expandUpTop}px`);
    content.style.setProperty(USER_MENU_VAR_SIGN_OUT_ORIGIN_LEFT, `${layout.expandUpLeft}px`);
    content.style.setProperty(USER_MENU_VAR_SIGN_OUT_ORIGIN_WIDTH, `${layout.expandUpWidth}px`);
    content.style.setProperty(USER_MENU_VAR_SIGN_OUT_ORIGIN_HEIGHT, `${layout.expandUpHeight}px`);
    content.classList.remove(USER_MENU_SIGN_OUT_PHASE_EXPAND_UP_CLASS);

    if (runId !== USER_MENU_SIGN_OUT_ANIMATION_RUN_ID.value) {
      return false;
    }

    await waitForNextFrame();

    content.classList.add(USER_MENU_SIGN_OUT_PHASE_EXPAND_FULL_CLASS);
    await waitForAnimationEnd(
      content,
      "signInExpandFull",
      expandFullMs + USER_MENU_ANIMATION_TIMEOUT_BUFFER_MS,
    );
    content.style.setProperty(USER_MENU_VAR_SIGN_OUT_ORIGIN_TOP, `${layout.fullTop}px`);
    content.style.setProperty(USER_MENU_VAR_SIGN_OUT_ORIGIN_LEFT, `${layout.fullLeft}px`);
    content.style.setProperty(USER_MENU_VAR_SIGN_OUT_ORIGIN_WIDTH, `${layout.fullWidth}px`);
    content.style.setProperty(USER_MENU_VAR_SIGN_OUT_ORIGIN_HEIGHT, `${layout.fullHeight}px`);
    content.classList.remove(USER_MENU_SIGN_OUT_PHASE_EXPAND_FULL_CLASS);

    if (runId !== USER_MENU_SIGN_OUT_ANIMATION_RUN_ID.value) {
      return false;
    }

    loadingStatus.classList.remove(USER_MENU_HIDDEN_CLASS);
    loadingStatus.classList.add(USER_MENU_SIGN_OUT_STATUS_LOADING_IN_CLASS);
    await waitForAnimationEnd(
      loadingStatus,
      "loginStatusFadeIn",
      dotsFadeInMs + USER_MENU_ANIMATION_TIMEOUT_BUFFER_MS,
    );
    loadingStatus.classList.remove(USER_MENU_SIGN_OUT_STATUS_LOADING_IN_CLASS);
    loadingStatus.classList.add("is-shown");

    if (runId !== USER_MENU_SIGN_OUT_ANIMATION_RUN_ID.value) {
      return false;
    }

    await delay(dotsRunMs);

    if (runId !== USER_MENU_SIGN_OUT_ANIMATION_RUN_ID.value) {
      return false;
    }

    loadingStatus.classList.remove("is-shown");
    loadingStatus.classList.add(USER_MENU_SIGN_OUT_STATUS_LOADING_OUT_CLASS);
    await waitForAnimationEnd(
      loadingStatus,
      "loginStatusFadeOut",
      dotsFadeOutMs + USER_MENU_ANIMATION_TIMEOUT_BUFFER_MS,
    );
    loadingStatus.classList.remove(USER_MENU_SIGN_OUT_STATUS_LOADING_OUT_CLASS);
    loadingStatus.classList.add(USER_MENU_HIDDEN_CLASS);

    if (runId !== USER_MENU_SIGN_OUT_ANIMATION_RUN_ID.value) {
      return false;
    }

    const resultStatus = resultIsSuccess ? successStatus : errorStatus;
    const circle = resultStatus.querySelector(USER_MENU_STATUS_ICON_CIRCLE_SELECTOR);
    const marks = [
      ...resultStatus.querySelectorAll(USER_MENU_STATUS_ICON_MARK_SELECTOR),
    ];

    resultStatus.classList.remove(USER_MENU_HIDDEN_CLASS);
    resultStatus.classList.add(USER_MENU_SIGN_OUT_RESULT_DRAW_CLASS, "is-animating");

    if (circle) {
      await waitForAnimationEnd(
        circle,
        "loginStatusCircleDraw",
        circleDuration + USER_MENU_ANIMATION_TIMEOUT_BUFFER_MS,
      );
    }

    if (runId !== USER_MENU_SIGN_OUT_ANIMATION_RUN_ID.value) {
      return false;
    }

    await Promise.all(
      marks.map((mark) =>
        waitForAnimationEnd(mark, "loginStatusMarkDraw", markDuration + USER_MENU_ANIMATION_TIMEOUT_BUFFER_MS),
      ),
    );

    if (runId !== USER_MENU_SIGN_OUT_ANIMATION_RUN_ID.value) {
      return false;
    }

    resultStatus.classList.remove("is-animating");
    resultStatus.classList.add("is-drawn");

    resultStatus.classList.add(USER_MENU_SIGN_OUT_RESULT_HIDE_CLASS);
    await waitForAnimationEnd(
      resultStatus,
      "loginStatusFadeOut",
      resultFadeOutMs + USER_MENU_ANIMATION_TIMEOUT_BUFFER_MS,
    );
    resultStatus.classList.remove(
      USER_MENU_SIGN_OUT_RESULT_DRAW_CLASS,
      USER_MENU_SIGN_OUT_RESULT_HIDE_CLASS,
      "is-drawn",
    );
    resultStatus.classList.add(USER_MENU_HIDDEN_CLASS);
    if (runId !== USER_MENU_SIGN_OUT_ANIMATION_RUN_ID.value) {
      return false;
    }

    content.classList.add(USER_MENU_SIGN_OUT_PHASE_SHRINK_PADDING_CLASS);
    await waitForAnimationEnd(
      content,
      "signInShrinkPadding",
      shrinkPaddingMs + USER_MENU_ANIMATION_TIMEOUT_BUFFER_MS,
    );
    content.style.setProperty(USER_MENU_VAR_SIGN_OUT_ORIGIN_TOP, `${layout.expandUpTop}px`);
    content.style.setProperty(USER_MENU_VAR_SIGN_OUT_ORIGIN_LEFT, `${layout.expandUpLeft}px`);
    content.style.setProperty(USER_MENU_VAR_SIGN_OUT_ORIGIN_WIDTH, `${layout.expandUpWidth}px`);
    content.style.setProperty(USER_MENU_VAR_SIGN_OUT_ORIGIN_HEIGHT, `${layout.expandUpHeight}px`);
    content.classList.remove(USER_MENU_SIGN_OUT_PHASE_SHRINK_PADDING_CLASS);

    if (runId !== USER_MENU_SIGN_OUT_ANIMATION_RUN_ID.value) {
      return false;
    }

    await waitForNextFrame();

    content.classList.add(USER_MENU_SIGN_OUT_PHASE_SHRINK_ORIGIN_CLASS);
    await waitForAnimationEnd(
      content,
      "signInShrinkOrigin",
      shrinkOriginMs + USER_MENU_ANIMATION_TIMEOUT_BUFFER_MS,
    );
    content.style.setProperty(USER_MENU_VAR_SIGN_OUT_ORIGIN_TOP, `${layout.originTop}px`);
    content.style.setProperty(USER_MENU_VAR_SIGN_OUT_ORIGIN_LEFT, `${layout.originLeft}px`);
    content.style.setProperty(USER_MENU_VAR_SIGN_OUT_ORIGIN_WIDTH, `${layout.originWidth}px`);
    content.style.setProperty(USER_MENU_VAR_SIGN_OUT_ORIGIN_HEIGHT, `${layout.originHeight}px`);
    content.classList.remove(USER_MENU_SIGN_OUT_PHASE_SHRINK_ORIGIN_CLASS);

    if (runId !== USER_MENU_SIGN_OUT_ANIMATION_RUN_ID.value) {
      return false;
    }

    if (panel) {
    panel.classList.remove(
      USER_MENU_SIGN_OUT_FADING_CHROME_CLASS,
      USER_MENU_SIGN_OUT_CHROME_HIDDEN_CLASS,
      USER_MENU_SIGN_OUT_CHROME_PREPARING_CLASS,
      USER_MENU_SIGN_OUT_CHROME_VISIBLE_CLASS,
    );

    panel.querySelectorAll(USER_MENU_SIGN_OUT_CHROME_SELECTORS).forEach((element) => {
      element.style.removeProperty("opacity");
      element.style.removeProperty("visibility");
      element.style.removeProperty("pointer-events");
    });

    if (content) {
      cssPhaseReset(content, ...USER_MENU_SIGN_OUT_CONTENT_PHASE_CLASSES);

      USER_MENU_SIGN_OUT_LAYOUT_VARS.forEach((layoutVar) => {
        content.style.removeProperty(layoutVar);
      });
    }

    panel.classList.remove(USER_MENU_SIGN_OUT_RUNNING_CLASS);
    panel.style.removeProperty("position");
  }

    if (isSignedInAfter) {
      await refreshAuth();
      userMenuSignInInputClear();

      const theme = themeRead();
      userMenuThemeButtonsApply(theme);
      userMenuThemeTrackApply(theme);
    } else if (resultIsSuccess) {
      await refreshAuth();
      userMenuSignInInputClear();
    }

    userMenuViewsApply(isSignedInAfter);

    if (!isSignedInAfter) {
      const authView = userMenuStateGet().authView || USER_MENU_AUTH_VIEW_SIGN_IN;

      userMenuAuthViewApply(authView);
      userMenuAuthTrackApply(authView);
    }

    await waitForNextFrame();
    panel.classList.add(USER_MENU_SIGN_OUT_CHROME_PREPARING_CLASS);
    panel.classList.remove(USER_MENU_SIGN_OUT_CHROME_HIDDEN_CLASS);
    void panel.offsetWidth;
    panel.classList.add(USER_MENU_SIGN_OUT_CHROME_VISIBLE_CLASS);

    await waitForTransitionEnd(
      header,
      "opacity",
      restoreFadeMs + USER_MENU_ANIMATION_TIMEOUT_BUFFER_MS,
    );

    panel.classList.remove(
      USER_MENU_SIGN_OUT_CHROME_PREPARING_CLASS,
      USER_MENU_SIGN_OUT_CHROME_VISIBLE_CLASS,
    );
    if (panel) {
    panel.classList.remove(
      USER_MENU_SIGN_OUT_FADING_CHROME_CLASS,
      USER_MENU_SIGN_OUT_CHROME_HIDDEN_CLASS,
      USER_MENU_SIGN_OUT_CHROME_PREPARING_CLASS,
      USER_MENU_SIGN_OUT_CHROME_VISIBLE_CLASS,
    );

    panel.querySelectorAll(USER_MENU_SIGN_OUT_CHROME_SELECTORS).forEach((element) => {
      element.style.removeProperty("opacity");
      element.style.removeProperty("visibility");
      element.style.removeProperty("pointer-events");
    });

    if (content) {
      cssPhaseReset(content, ...USER_MENU_SIGN_OUT_CONTENT_PHASE_CLASSES);

      USER_MENU_SIGN_OUT_LAYOUT_VARS.forEach((layoutVar) => {
        content.style.removeProperty(layoutVar);
      });
    }

    panel.classList.remove(USER_MENU_SIGN_OUT_RUNNING_CLASS);
    panel.style.removeProperty("position");
  }

    return resultIsSuccess;
  } finally {
    if (runId === USER_MENU_SIGN_OUT_ANIMATION_RUN_ID.value) {
      userMenuStateSet({ isSignInRunning: false });
      document
        .querySelector(USER_MENU_ROOT_SELECTOR)
        ?.classList.toggle(USER_MENU_SIGN_OUT_LOCKED_CLASS, false);
    }
  }
}
