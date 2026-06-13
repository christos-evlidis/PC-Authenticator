import { animAnimationEndWait } from "../../../utils/utility-animation.js";
import { animCssMsGet } from "../../../utils/utility-animation.js";
import { animDelay } from "../../../utils/utility-animation.js";
import { animFrameWait } from "../../../utils/utility-animation.js";
import { animPhaseReset } from "../../../utils/utility-animation.js";
import { animTransitionEndWait } from "../../../utils/utility-animation.js";

import { userMenuDomGet } from "./user-menu.dom.js";
import { userMenuDomSet } from "./user-menu.dom.js";

import { userMenuStateRunIdGet } from "./user-menu.state.js";
import { userMenuStateRunIdNext } from "./user-menu.state.js";

import { VAR_BUFFER_MS } from "../../../const/const.utility.js";
import { VAR_FADE_MS } from "../../../const/const.utility.js";
import { VAR_HOLD_MS } from "../../../const/const.utility.js";
import { VAR_RESULT_COPY_DRAW_MS } from "../../../const/const.utility.js";

import * as UM from "../../../const/const.user-menu.js";


/** Runs the full-panel auth loading and result animation. */
async function userMenuAnimationRun(authType, authResult, onResult, onRestore) {
  const p = authType === "signUp" ? "SIGN_UP" : authType === "signOut" ? "SIGN_OUT" : "SIGN_IN";
  const runIdKey = authType === "signUp" ? "signUp" : authType === "signOut" ? "signOut" : "signIn";
  const cfg = {
    runIdKey,
    fadeClass: UM[`USER_MENU_${p}_FADE_CLASS`],
    restoreFadeClass: UM[`USER_MENU_${p}_RESTORE_FADE_CLASS`],
    runningClass: UM[`USER_MENU_${p}_RUNNING_CLASS`],
    lockedClass: UM[`USER_MENU_${p}_LOCKED_CLASS`],
    absoluteClass: UM[`USER_MENU_${p}_ABSOLUTE_CLASS`],
    expandUpClass: UM[`USER_MENU_${p}_EXPAND_UP_CLASS`],
    expandFullClass: UM[`USER_MENU_${p}_EXPAND_FULL_CLASS`],
    expandExtensionClass: UM[`USER_MENU_${p}_EXPAND_EXTENSION_CLASS`],
    dotsFadeInClass: UM[`USER_MENU_${p}_DOTS_FADE_IN_CLASS`],
    dotsRunClass: UM[`USER_MENU_${p}_DOTS_RUN_CLASS`],
    dotsFadeOutClass: UM[`USER_MENU_${p}_DOTS_FADE_OUT_CLASS`],
    resultDrawClass: UM[`USER_MENU_${p}_RESULT_DRAW_CLASS`],
    resultFadeOutClass: UM[`USER_MENU_${p}_RESULT_FADE_OUT_CLASS`],
    shrinkToFullClass: UM[`USER_MENU_${p}_SHRINK_TO_FULL_CLASS`],
    shrinkFullClass: UM[`USER_MENU_${p}_SHRINK_FULL_CLASS`],
    shrinkDownClass: UM[`USER_MENU_${p}_SHRINK_DOWN_CLASS`],
    contentPhaseClasses: UM[`USER_MENU_${p}_CONTENT_PHASE_CLASSES`],
    layoutVars: UM[`USER_MENU_${p}_LAYOUT_VARS`],
    fadeSelectors: UM[`USER_MENU_${p}_FADE_SELECTORS`],
    varFadeMs: UM[`USER_MENU_VAR_${p}_FADE_MS`],
    varExpandUpMs: UM[`USER_MENU_VAR_${p}_EXPAND_UP_MS`],
    varExpandFullMs: UM[`USER_MENU_VAR_${p}_EXPAND_FULL_MS`],
    varExpandExtensionMs: UM[`USER_MENU_VAR_${p}_EXPAND_EXTENSION_MS`],
    varDotsFadeInMs: UM[`USER_MENU_VAR_${p}_DOTS_FADE_IN_MS`],
    varDotsRunMs: UM[`USER_MENU_VAR_${p}_DOTS_RUN_MS`],
    varDotsFadeOutMs: UM[`USER_MENU_VAR_${p}_DOTS_FADE_OUT_MS`],
    varResultDrawMs: UM[`USER_MENU_VAR_${p}_RESULT_DRAW_MS`],
    varResultFadeOutMs: UM[`USER_MENU_VAR_${p}_RESULT_FADE_OUT_MS`],
    varShrinkToFullMs: UM[`USER_MENU_VAR_${p}_SHRINK_TO_FULL_MS`],
    varShrinkFullMs: UM[`USER_MENU_VAR_${p}_SHRINK_FULL_MS`],
    varShrinkDownMs: UM[`USER_MENU_VAR_${p}_SHRINK_DOWN_MS`],
    varRestoreFadeMs: UM[`USER_MENU_VAR_${p}_RESTORE_FADE_MS`],
    varOriginTop: UM[`USER_MENU_VAR_${p}_ORIGIN_TOP`],
    varOriginLeft: UM[`USER_MENU_VAR_${p}_ORIGIN_LEFT`],
    varOriginWidth: UM[`USER_MENU_VAR_${p}_ORIGIN_WIDTH`],
    varOriginHeight: UM[`USER_MENU_VAR_${p}_ORIGIN_HEIGHT`],
    varExpandTop: UM[`USER_MENU_VAR_${p}_EXPAND_TOP`],
    varExpandLeft: UM[`USER_MENU_VAR_${p}_EXPAND_LEFT`],
    varExpandWidth: UM[`USER_MENU_VAR_${p}_EXPAND_WIDTH`],
    varExpandHeight: UM[`USER_MENU_VAR_${p}_EXPAND_HEIGHT`],
    varFullTop: UM[`USER_MENU_VAR_${p}_FULL_TOP`],
    varFullLeft: UM[`USER_MENU_VAR_${p}_FULL_LEFT`],
    varFullWidth: UM[`USER_MENU_VAR_${p}_FULL_WIDTH`],
    varFullHeight: UM[`USER_MENU_VAR_${p}_FULL_HEIGHT`],
    varExtensionTop: UM[`USER_MENU_VAR_${p}_EXTENSION_TOP`],
    varExtensionLeft: UM[`USER_MENU_VAR_${p}_EXTENSION_LEFT`],
    varExtensionWidth: UM[`USER_MENU_VAR_${p}_EXTENSION_WIDTH`],
    varExtensionHeight: UM[`USER_MENU_VAR_${p}_EXTENSION_HEIGHT`],
    varRestoreTop: UM[`USER_MENU_VAR_${p}_RESTORE_TOP`],
    varRestoreLeft: UM[`USER_MENU_VAR_${p}_RESTORE_LEFT`],
    varRestoreWidth: UM[`USER_MENU_VAR_${p}_RESTORE_WIDTH`],
    varRestoreHeight: UM[`USER_MENU_VAR_${p}_RESTORE_HEIGHT`],
  };
  const id = userMenuStateRunIdNext(cfg.runIdKey);

  const dom = userMenuDomGet();
  const {
    panel,
    header,
    authBar,
    content,
    signedOutView,
    statusLoading: loadingStatus,
    statusSuccess: successStatus,
    statusError: errorStatus,
    root,
  } = dom;

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
    return authResult;
  }

  if (panel) {
    panel.classList.remove(cfg.fadeClass, cfg.restoreFadeClass);

    panel.querySelectorAll(cfg.fadeSelectors).forEach((element) => {
      element.style.removeProperty("opacity");
      element.style.removeProperty("visibility");
      element.style.removeProperty("pointer-events");
    });

    if (content) {
      animPhaseReset(content, ...cfg.contentPhaseClasses);

      cfg.layoutVars.forEach((layoutVar) => {
        content.style.removeProperty(layoutVar);
      });
    }

    panel.classList.remove(cfg.runningClass);
  }

  root?.classList.toggle(cfg.lockedClass, true);

  try {
    const panelRect = panel.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    const panelStyles = getComputedStyle(panel);
    const panelPaddingTop = Number.parseFloat(panelStyles.paddingTop) || 12;
    const overlayRoot = panel.closest(UM.USER_MENU_ROOT_SELECTOR);
    const overlayRect = overlayRoot?.getBoundingClientRect() ?? panelRect;
    const overlayStyles = overlayRoot
      ? getComputedStyle(overlayRoot)
      : panelStyles;
    const overlayPaddingTop = Number.parseFloat(overlayStyles.paddingTop) || 0;
    const overlayPaddingRight =
      Number.parseFloat(overlayStyles.paddingRight) || 0;
    const overlayPaddingBottom =
      Number.parseFloat(overlayStyles.paddingBottom) || 0;
    const overlayPaddingLeft =
      Number.parseFloat(overlayStyles.paddingLeft) || 0;
    const extensionInnerTop = overlayRect.top + overlayPaddingTop;
    const extensionInnerLeft = overlayRect.left + overlayPaddingLeft;
    const extensionInnerWidth =
      overlayRect.width - overlayPaddingLeft - overlayPaddingRight;
    const extensionInnerHeight =
      overlayRect.height - overlayPaddingTop - overlayPaddingBottom;
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
      extensionTop: extensionInnerTop - panelRect.top,
      extensionLeft: extensionInnerLeft - panelRect.left,
      extensionWidth: extensionInnerWidth,
      extensionHeight: extensionInnerHeight,
    };
    const fadeMs = animCssMsGet(panel, cfg.varFadeMs);
    const expandUpMs = animCssMsGet(panel, cfg.varExpandUpMs);
    const expandFullMs = animCssMsGet(panel, cfg.varExpandFullMs);
    const expandExtensionMs = animCssMsGet(panel, cfg.varExpandExtensionMs);
    const dotsFadeInMs = animCssMsGet(panel, cfg.varDotsFadeInMs);
    const dotsRunMs = animCssMsGet(panel, cfg.varDotsRunMs);
    const dotsFadeOutMs = animCssMsGet(panel, cfg.varDotsFadeOutMs);
    const resultDrawMs = animCssMsGet(panel, cfg.varResultDrawMs);
    const resultFadeOutMs = animCssMsGet(panel, cfg.varResultFadeOutMs);
    const shrinkToFullMs = animCssMsGet(panel, cfg.varShrinkToFullMs);
    const shrinkFullMs = animCssMsGet(panel, cfg.varShrinkFullMs);
    const shrinkDownMs = animCssMsGet(panel, cfg.varShrinkDownMs);
    const restoreFadeMs = animCssMsGet(panel, cfg.varRestoreFadeMs);
    const timeoutBufferMs = animCssMsGet(
      panel,
      UM.USER_MENU_VAR_ANIMATION_TIMEOUT_BUFFER_MS,
    );
    const circleDuration = Math.round(resultDrawMs * 0.45);
    const markDuration = resultDrawMs - circleDuration;

    panel.classList.add(cfg.runningClass);
    [loadingStatus, successStatus, errorStatus].forEach((status) => {
      if (!status) {
        return;
      }

      status.classList.add(UM.USER_MENU_HIDDEN_CLASS);
      status.classList.remove(
        cfg.dotsFadeInClass,
        cfg.dotsFadeOutClass,
        cfg.dotsRunClass,
        cfg.resultDrawClass,
        cfg.resultFadeOutClass,
        "is-animating",
        "is-drawn",
      );
    });

    panel.classList.add(cfg.fadeClass);
    await animDelay(fadeMs);
    panel.classList.remove(cfg.fadeClass);

    if (id !== userMenuStateRunIdGet(cfg.runIdKey)) {
      return false;
    }

    content.style.setProperty(cfg.varOriginTop, `${layout.originTop}px`);
    content.style.setProperty(cfg.varOriginLeft, `${layout.originLeft}px`);
    content.style.setProperty(cfg.varOriginWidth, `${layout.originWidth}px`);
    content.style.setProperty(cfg.varOriginHeight, `${layout.originHeight}px`);
    content.style.setProperty(cfg.varExpandTop, `${layout.expandUpTop}px`);
    content.style.setProperty(cfg.varExpandLeft, `${layout.expandUpLeft}px`);
    content.style.setProperty(cfg.varExpandWidth, `${layout.expandUpWidth}px`);
    content.style.setProperty(
      cfg.varExpandHeight,
      `${layout.expandUpHeight}px`,
    );
    content.style.setProperty(cfg.varFullTop, `${layout.fullTop}px`);
    content.style.setProperty(cfg.varFullLeft, `${layout.fullLeft}px`);
    content.style.setProperty(cfg.varFullWidth, `${layout.fullWidth}px`);
    content.style.setProperty(cfg.varFullHeight, `${layout.fullHeight}px`);
    content.style.setProperty(cfg.varExtensionTop, `${layout.extensionTop}px`);
    content.style.setProperty(
      cfg.varExtensionLeft,
      `${layout.extensionLeft}px`,
    );
    content.style.setProperty(
      cfg.varExtensionWidth,
      `${layout.extensionWidth}px`,
    );
    content.style.setProperty(
      cfg.varExtensionHeight,
      `${layout.extensionHeight}px`,
    );
    content.style.setProperty(cfg.varRestoreTop, `${layout.originTop}px`);
    content.style.setProperty(cfg.varRestoreLeft, `${layout.originLeft}px`);
    content.style.setProperty(cfg.varRestoreWidth, `${layout.originWidth}px`);
    content.style.setProperty(cfg.varRestoreHeight, `${layout.originHeight}px`);
    content.classList.add(cfg.absoluteClass);

    await animFrameWait();

    content.classList.add(cfg.expandUpClass);
    await animAnimationEndWait(
      content,
      "signInExpandUp",
      expandUpMs + timeoutBufferMs,
    );
    content.style.setProperty(cfg.varOriginTop, `${layout.expandUpTop}px`);
    content.style.setProperty(cfg.varOriginLeft, `${layout.expandUpLeft}px`);
    content.style.setProperty(cfg.varOriginWidth, `${layout.expandUpWidth}px`);
    content.style.setProperty(
      cfg.varOriginHeight,
      `${layout.expandUpHeight}px`,
    );
    content.classList.remove(cfg.expandUpClass);

    if (id !== userMenuStateRunIdGet(cfg.runIdKey)) {
      return false;
    }

    await animFrameWait();

    content.classList.add(cfg.expandFullClass);
    await animAnimationEndWait(
      content,
      "signInExpandFull",
      expandFullMs + timeoutBufferMs,
    );
    content.style.setProperty(cfg.varOriginTop, `${layout.fullTop}px`);
    content.style.setProperty(cfg.varOriginLeft, `${layout.fullLeft}px`);
    content.style.setProperty(cfg.varOriginWidth, `${layout.fullWidth}px`);
    content.style.setProperty(cfg.varOriginHeight, `${layout.fullHeight}px`);
    content.classList.remove(cfg.expandFullClass);

    if (id !== userMenuStateRunIdGet(cfg.runIdKey)) {
      return false;
    }

    await animFrameWait();

    content.classList.add(cfg.expandExtensionClass);
    await animAnimationEndWait(
      content,
      "signInExpandExtension",
      expandExtensionMs + timeoutBufferMs,
    );
    content.style.setProperty(cfg.varOriginTop, `${layout.extensionTop}px`);
    content.style.setProperty(cfg.varOriginLeft, `${layout.extensionLeft}px`);
    content.style.setProperty(cfg.varOriginWidth, `${layout.extensionWidth}px`);
    content.style.setProperty(
      cfg.varOriginHeight,
      `${layout.extensionHeight}px`,
    );
    content.classList.remove(cfg.expandExtensionClass);

    if (id !== userMenuStateRunIdGet(cfg.runIdKey)) {
      return false;
    }

    loadingStatus.classList.remove(UM.USER_MENU_HIDDEN_CLASS);
    loadingStatus.classList.add(cfg.dotsFadeInClass);
    await animAnimationEndWait(
      loadingStatus,
      "userMenuStatusFadeIn",
      dotsFadeInMs + timeoutBufferMs,
    );
    loadingStatus.classList.remove(cfg.dotsFadeInClass);
    loadingStatus.classList.add(cfg.dotsRunClass);

    if (id !== userMenuStateRunIdGet(cfg.runIdKey)) {
      return false;
    }

    await animDelay(dotsRunMs);

    if (id !== userMenuStateRunIdGet(cfg.runIdKey)) {
      return false;
    }

    loadingStatus.classList.remove(cfg.dotsRunClass);
    loadingStatus.classList.add(cfg.dotsFadeOutClass);
    await animAnimationEndWait(
      loadingStatus,
      "userMenuStatusFadeOut",
      dotsFadeOutMs + timeoutBufferMs,
    );
    loadingStatus.classList.remove(cfg.dotsFadeOutClass);
    loadingStatus.classList.add(UM.USER_MENU_HIDDEN_CLASS);

    if (id !== userMenuStateRunIdGet(cfg.runIdKey)) {
      return false;
    }

    const resultStatus = authResult ? successStatus : errorStatus;
    const circle = resultStatus.querySelector(
      UM.USER_MENU_STATUS_ICON_CIRCLE_SELECTOR,
    );
    const marks = [
      ...resultStatus.querySelectorAll(UM.USER_MENU_STATUS_ICON_MARK_SELECTOR),
    ];

    resultStatus.classList.remove(UM.USER_MENU_HIDDEN_CLASS);
    resultStatus.classList.add(cfg.resultDrawClass, "is-animating");

    if (onResult) {
      onResult().catch(console.error);
    }

    if (circle) {
      await animAnimationEndWait(
        circle,
        "userMenuStatusCircleDraw",
        circleDuration + timeoutBufferMs,
      );
    }

    if (id !== userMenuStateRunIdGet(cfg.runIdKey)) {
      return false;
    }

    await Promise.all(
      marks.map((mark) =>
        animAnimationEndWait(
          mark,
          "userMenuStatusMarkDraw",
          markDuration + timeoutBufferMs,
        ),
      ),
    );

    if (id !== userMenuStateRunIdGet(cfg.runIdKey)) {
      return false;
    }

    resultStatus.classList.remove("is-animating");
    resultStatus.classList.add("is-drawn");

    resultStatus.classList.add(cfg.resultFadeOutClass);
    await animAnimationEndWait(
      resultStatus,
      "userMenuStatusFadeOut",
      resultFadeOutMs + timeoutBufferMs,
    );
    resultStatus.classList.remove(
      cfg.resultDrawClass,
      cfg.resultFadeOutClass,
      "is-drawn",
    );
    resultStatus.classList.add(UM.USER_MENU_HIDDEN_CLASS);
    if (id !== userMenuStateRunIdGet(cfg.runIdKey)) {
      return false;
    }

    content.classList.add(cfg.shrinkToFullClass);
    await animAnimationEndWait(
      content,
      "signInShrinkToFull",
      shrinkToFullMs + timeoutBufferMs,
    );
    content.style.setProperty(cfg.varOriginTop, `${layout.fullTop}px`);
    content.style.setProperty(cfg.varOriginLeft, `${layout.fullLeft}px`);
    content.style.setProperty(cfg.varOriginWidth, `${layout.fullWidth}px`);
    content.style.setProperty(cfg.varOriginHeight, `${layout.fullHeight}px`);
    content.classList.remove(cfg.shrinkToFullClass);

    if (id !== userMenuStateRunIdGet(cfg.runIdKey)) {
      return false;
    }

    await animFrameWait();

    content.classList.add(cfg.shrinkFullClass);
    await animAnimationEndWait(
      content,
      "signInShrinkFull",
      shrinkFullMs + timeoutBufferMs,
    );
    content.style.setProperty(cfg.varOriginTop, `${layout.expandUpTop}px`);
    content.style.setProperty(cfg.varOriginLeft, `${layout.expandUpLeft}px`);
    content.style.setProperty(cfg.varOriginWidth, `${layout.expandUpWidth}px`);
    content.style.setProperty(
      cfg.varOriginHeight,
      `${layout.expandUpHeight}px`,
    );
    content.classList.remove(cfg.shrinkFullClass);

    if (id !== userMenuStateRunIdGet(cfg.runIdKey)) {
      return false;
    }

    await animFrameWait();

    content.classList.add(cfg.shrinkDownClass);
    await animAnimationEndWait(
      content,
      "signInShrinkDown",
      shrinkDownMs + timeoutBufferMs,
    );
    content.style.setProperty(cfg.varOriginTop, `${layout.originTop}px`);
    content.style.setProperty(cfg.varOriginLeft, `${layout.originLeft}px`);
    content.style.setProperty(cfg.varOriginWidth, `${layout.originWidth}px`);
    content.style.setProperty(cfg.varOriginHeight, `${layout.originHeight}px`);
    content.classList.remove(cfg.shrinkDownClass);

    if (id !== userMenuStateRunIdGet(cfg.runIdKey)) {
      return false;
    }

    if (content) {
      animPhaseReset(content, ...cfg.contentPhaseClasses);

      cfg.layoutVars.forEach((layoutVar) => {
        content.style.removeProperty(layoutVar);
      });
    }

    if (onRestore) {
      await onRestore();
    }

    await animFrameWait();
    panel.classList.add(cfg.restoreFadeClass);

    await animAnimationEndWait(
      header,
      "userMenuRestoreFade",
      restoreFadeMs + timeoutBufferMs,
    );

    if (panel) {
      panel.classList.remove(
        cfg.fadeClass,
        cfg.restoreFadeClass,
        cfg.runningClass,
      );

      panel.querySelectorAll(cfg.fadeSelectors).forEach((element) => {
        element.style.removeProperty("opacity");
        element.style.removeProperty("visibility");
        element.style.removeProperty("pointer-events");
      });
    }

    return authResult;
  } finally {
    if (id === userMenuStateRunIdGet(cfg.runIdKey)) {
      root?.classList.toggle(cfg.lockedClass, false);
    }
  }
}

// Animates the user menu panel sliding open.
async function userMenuAnimationPanelOpen() {
  const id = userMenuStateRunIdNext("panel");
  const dom = userMenuDomGet();
  const { root, panel } = dom;

  if (!root || !panel) {
    return;
  }

  root.classList.remove(
    UM.USER_MENU_PANEL_OPENING_CLASS,
    UM.USER_MENU_PANEL_OPEN_CLASS,
    UM.USER_MENU_PANEL_CLOSING_CLASS,
    UM.USER_MENU_PANEL_BACKDROP_CLOSING_CLASS,
  );
  panel.classList.remove(
    UM.USER_MENU_PANEL_OPENING_CLASS,
    UM.USER_MENU_PANEL_OPEN_CLASS,
    UM.USER_MENU_PANEL_CLOSING_CLASS,
  );

  try {
    dom.openBtns.forEach((button) => {
      button.classList.toggle(UM.USER_MENU_HEADER_BTN_ACTIVE_CLASS, true);
    });
    root.classList.add(UM.USER_MENU_PANEL_ACTIVE_CLASS);
    root.classList.add(UM.USER_MENU_OPEN_CLASS);
    root.classList.add(UM.USER_MENU_PANEL_OPENING_CLASS);

    await animFrameWait();

    if (id !== userMenuStateRunIdGet("panel")) {
      return;
    }

    root.classList.add(UM.USER_MENU_PANEL_OPEN_CLASS);

    await animTransitionEndWait(
      panel,
      "transform",
      animCssMsGet(root, UM.USER_MENU_VAR_SLIDE_MS) +
        animCssMsGet(root, UM.USER_MENU_VAR_BLUR_MS) +
        animCssMsGet(root, UM.USER_MENU_VAR_ANIMATION_TIMEOUT_BUFFER_MS),
    );
  } finally {
    if (id === userMenuStateRunIdGet("panel")) {
      root.classList.remove(UM.USER_MENU_PANEL_OPENING_CLASS);
    }
  }
}

// Animates the user menu panel sliding closed.
async function userMenuAnimationPanelClose() {
  const id = userMenuStateRunIdNext("panel");
  const dom = userMenuDomGet();
  const { root, panel, backdrop } = dom;

  if (!root || !panel) {
    return;
  }

  try {
    dom.openBtns.forEach((button) => {
      button.classList.toggle(UM.USER_MENU_HEADER_BTN_ACTIVE_CLASS, false);
    });

    root.classList.add(UM.USER_MENU_PANEL_CLOSING_CLASS);

    await animTransitionEndWait(
      panel,
      "transform",
      animCssMsGet(root, UM.USER_MENU_VAR_SLIDE_MS) +
        animCssMsGet(root, UM.USER_MENU_VAR_ANIMATION_TIMEOUT_BUFFER_MS),
    );

    if (id !== userMenuStateRunIdGet("panel")) {
      return;
    }

    root.classList.remove(UM.USER_MENU_PANEL_OPEN_CLASS);
    root.classList.add(UM.USER_MENU_PANEL_BACKDROP_CLOSING_CLASS);

    await animFrameWait();

    if (id !== userMenuStateRunIdGet("panel")) {
      return;
    }

    if (backdrop) {
      await animTransitionEndWait(
        backdrop,
        "opacity",
        animCssMsGet(root, UM.USER_MENU_VAR_BLUR_MS) +
          animCssMsGet(root, UM.USER_MENU_VAR_ANIMATION_TIMEOUT_BUFFER_MS),
      );
    }

    if (id !== userMenuStateRunIdGet("panel")) {
      return;
    }

    root.classList.remove(UM.USER_MENU_OPEN_CLASS);
    root.classList.remove(UM.USER_MENU_PANEL_ACTIVE_CLASS);
  } finally {
    if (id === userMenuStateRunIdGet("panel")) {
      root.classList.remove(
        UM.USER_MENU_PANEL_OPENING_CLASS,
        UM.USER_MENU_PANEL_OPEN_CLASS,
        UM.USER_MENU_PANEL_CLOSING_CLASS,
        UM.USER_MENU_PANEL_BACKDROP_CLOSING_CLASS,
      );
      panel.classList.remove(
        UM.USER_MENU_PANEL_OPENING_CLASS,
        UM.USER_MENU_PANEL_OPEN_CLASS,
        UM.USER_MENU_PANEL_CLOSING_CLASS,
      );
    }
  }
}

// Animates the toggle switch between the sign in and sign up views.
async function userMenuAnimationSwitchAuth(authView) {
  const dom = userMenuDomGet();
  const { authTrack: track, authThumb: thumb } = dom;

  if (!track || !thumb) {
    return;
  }

  await animTransitionEndWait(
    thumb,
    "transform",
    animCssMsGet(track, UM.USER_MENU_VAR_AUTH_THUMB_MS) +
      animCssMsGet(track, UM.USER_MENU_VAR_ANIMATION_TIMEOUT_BUFFER_MS),
  );
}

// Animates the toggle switch between the light and dark theme views.
async function userMenuAnimationSwitchTheme(themeView) {
  const dom = userMenuDomGet();
  const { themeTrack: track, themeThumb: thumb } = dom;

  if (!track || !thumb) {
    return;
  }

  await animTransitionEndWait(
    thumb,
    "transform",
    animCssMsGet(track, UM.USER_MENU_VAR_THEME_THUMB_MS) +
      animCssMsGet(track, UM.USER_MENU_VAR_ANIMATION_TIMEOUT_BUFFER_MS),
  );
}

// Animates copy button checkmark feedback.
async function userMenuAnimationCopyRun() {
  const dom = userMenuDomGet();
  const btn = dom.accountCopyBtn;

  if (!btn) {
    return;
  }

  const id = userMenuStateRunIdNext("copy");

  const checkDrawMs = animCssMsGet(btn, VAR_RESULT_COPY_DRAW_MS) || 250;
  const holdMs = animCssMsGet(btn, VAR_HOLD_MS) || 250;
  const fadeMs = animCssMsGet(btn, VAR_FADE_MS) || 250;
  const timeoutBufferMs = animCssMsGet(btn, VAR_BUFFER_MS) || 50;

  try {
    userMenuDomSet({ showCopyCheck: true });

    await animDelay(checkDrawMs + holdMs + fadeMs + timeoutBufferMs);

    if (id !== userMenuStateRunIdGet("copy")) {
      return;
    }
  } finally {
    if (id === userMenuStateRunIdGet("copy")) {
      userMenuDomSet({ showCopyCheck: false });
    }
  }
}

// Animates download button checkmark feedback.
async function userMenuAnimationDownloadRun() {
  const dom = userMenuDomGet();
  const btn = dom.accountDownloadBtn;

  if (!btn) {
    return;
  }

  const id = userMenuStateRunIdNext("download");

  const checkDrawMs = animCssMsGet(btn, VAR_RESULT_COPY_DRAW_MS) || 250;
  const holdMs = animCssMsGet(btn, VAR_HOLD_MS) || 250;
  const fadeMs = animCssMsGet(btn, VAR_FADE_MS) || 250;
  const timeoutBufferMs = animCssMsGet(btn, VAR_BUFFER_MS) || 50;

  try {
    userMenuDomSet({ showDownloadCheck: true });

    await animDelay(checkDrawMs + holdMs + fadeMs + timeoutBufferMs);

    if (id !== userMenuStateRunIdGet("download")) {
      return;
    }
  } finally {
    if (id === userMenuStateRunIdGet("download")) {
      userMenuDomSet({ showDownloadCheck: false });
    }
  }
}


export { userMenuAnimationPanelClose };
export { userMenuAnimationPanelOpen };
export { userMenuAnimationRun };
export { userMenuAnimationSwitchAuth };
export { userMenuAnimationSwitchTheme };
export { userMenuAnimationCopyRun };
export { userMenuAnimationDownloadRun };


