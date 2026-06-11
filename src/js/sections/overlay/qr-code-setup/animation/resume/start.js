import { animAnimationEndWait } from "../../../../../utils/utility-animation.js";
import { animCssMsGet } from "../../../../../utils/utility-animation.js";
import { animDelay } from "../../../../../utils/utility-animation.js";
import { animFrameWait } from "../../../../../utils/utility-animation.js";
import { animPhaseReset } from "../../../../../utils/utility-animation.js";
import { qrSetupActionLockSet } from "../../action/lock/set.js";
import { qrSetupStateSet } from "../../state/set.js";

import { QR_SETUP_CONTENT_SELECTOR } from "../../qr-code-setup-const.js";
import { QR_SETUP_HIDDEN_CLASS } from "../../qr-code-setup-const.js";
import { QR_SETUP_PANEL_SELECTOR } from "../../qr-code-setup-const.js";
import { QR_SETUP_RESUME_ABSOLUTE_CLASS } from "../../qr-code-setup-const.js";
import { QR_SETUP_RESUME_ANIMATION_RUN_ID } from "../../qr-code-setup-const.js";
import { QR_SETUP_RESUME_CONTENT_PHASE_CLASSES } from "../../qr-code-setup-const.js";
import { QR_SETUP_RESUME_DOTS_FADE_IN_CLASS } from "../../qr-code-setup-const.js";
import { QR_SETUP_RESUME_DOTS_FADE_OUT_CLASS } from "../../qr-code-setup-const.js";
import { QR_SETUP_RESUME_DOTS_RUN_CLASS } from "../../qr-code-setup-const.js";
import { QR_SETUP_RESUME_EXPAND_EXTENSION_CLASS } from "../../qr-code-setup-const.js";
import { QR_SETUP_RESUME_EXPAND_FULL_CLASS } from "../../qr-code-setup-const.js";
import { QR_SETUP_RESUME_EXPAND_UP_CLASS } from "../../qr-code-setup-const.js";
import { QR_SETUP_RESUME_FADE_CLASS } from "../../qr-code-setup-const.js";
import { QR_SETUP_RESUME_FADE_SELECTORS } from "../../qr-code-setup-const.js";
import { QR_SETUP_RESUME_LAYOUT_VARS } from "../../qr-code-setup-const.js";
import { QR_SETUP_RESUME_LOCKED_CLASS } from "../../qr-code-setup-const.js";
import { QR_SETUP_RESUME_RESULT_DRAW_CLASS } from "../../qr-code-setup-const.js";
import { QR_SETUP_RESUME_RESULT_FADE_OUT_CLASS } from "../../qr-code-setup-const.js";
import { QR_SETUP_RESUME_RUNNING_CLASS } from "../../qr-code-setup-const.js";
import { QR_SETUP_RESUME_SHRINK_FULL_CLASS } from "../../qr-code-setup-const.js";
import { QR_SETUP_RESUME_SHRINK_TO_FULL_CLASS } from "../../qr-code-setup-const.js";
import { QR_SETUP_ROOT_SELECTOR } from "../../qr-code-setup-const.js";
import { QR_SETUP_STATUS_ERROR_SELECTOR } from "../../qr-code-setup-const.js";
import { QR_SETUP_STATUS_ICON_CIRCLE_SELECTOR } from "../../qr-code-setup-const.js";
import { QR_SETUP_STATUS_ICON_MARK_SELECTOR } from "../../qr-code-setup-const.js";
import { QR_SETUP_STATUS_LOADING_SELECTOR } from "../../qr-code-setup-const.js";
import { QR_SETUP_STATUS_SUCCESS_SELECTOR } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_ANIMATION_TIMEOUT_BUFFER_MS } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_DOTS_FADE_IN_MS } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_DOTS_FADE_OUT_MS } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_DOTS_RUN_MS } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_EXPAND_EXTENSION_MS } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_EXPAND_FULL_MS } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_EXPAND_HEIGHT } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_EXPAND_LEFT } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_EXPAND_TOP } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_EXPAND_UP_MS } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_EXPAND_WIDTH } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_EXTENSION_HEIGHT } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_EXTENSION_LEFT } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_EXTENSION_TOP } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_EXTENSION_WIDTH } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_FADE_MS } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_FULL_HEIGHT } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_FULL_LEFT } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_FULL_TOP } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_FULL_WIDTH } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_ORIGIN_HEIGHT } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_ORIGIN_LEFT } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_ORIGIN_TOP } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_ORIGIN_WIDTH } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_RESULT_DRAW_MS } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_RESULT_FADE_OUT_MS } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_RESTORE_HEIGHT } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_RESTORE_LEFT } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_RESTORE_TOP } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_RESTORE_WIDTH } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_SHRINK_FULL_MS } from "../../qr-code-setup-const.js";
import { QR_SETUP_VAR_RESUME_SHRINK_TO_FULL_MS } from "../../qr-code-setup-const.js";

/** Runs fade, expand, loading dots, result draw, and shrink resume animation. */
async function qrSetupAnimationResumeStart(resolveWork) {
  const runId = QR_SETUP_RESUME_ANIMATION_RUN_ID.value + 1;
  QR_SETUP_RESUME_ANIMATION_RUN_ID.value = runId;

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
    try {
      return await resolveWork();
    } catch {
      return false;
    }
  }

  panel.classList.remove(QR_SETUP_RESUME_FADE_CLASS);
  panel.querySelectorAll(QR_SETUP_RESUME_FADE_SELECTORS).forEach((element) => {
    element.style.removeProperty("opacity");
    element.style.removeProperty("visibility");
    element.style.removeProperty("pointer-events");
  });
  animPhaseReset(content, ...QR_SETUP_RESUME_CONTENT_PHASE_CLASSES);
  QR_SETUP_RESUME_LAYOUT_VARS.forEach((layoutVar) => {
    content.style.removeProperty(layoutVar);
  });
  panel.classList.remove(QR_SETUP_RESUME_RUNNING_CLASS);

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
    const panelRect = panel.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    const panelStyles = getComputedStyle(panel);
    const panelPaddingTop = Number.parseFloat(panelStyles.paddingTop) || 12;
    const overlayRoot = panel.closest(QR_SETUP_ROOT_SELECTOR);
    const overlayRect = overlayRoot?.getBoundingClientRect() ?? panelRect;
    const overlayStyles = overlayRoot ? getComputedStyle(overlayRoot) : panelStyles;
    const overlayPaddingTop = Number.parseFloat(overlayStyles.paddingTop) || 0;
    const overlayPaddingRight = Number.parseFloat(overlayStyles.paddingRight) || 0;
    const overlayPaddingBottom = Number.parseFloat(overlayStyles.paddingBottom) || 0;
    const overlayPaddingLeft = Number.parseFloat(overlayStyles.paddingLeft) || 0;
    const extensionInnerTop = overlayRect.top + overlayPaddingTop;
    const extensionInnerLeft = overlayRect.left + overlayPaddingLeft;
    const extensionInnerWidth = overlayRect.width - overlayPaddingLeft - overlayPaddingRight;
    const extensionInnerHeight = overlayRect.height - overlayPaddingTop - overlayPaddingBottom;
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

    const resumeFadeMs = animCssMsGet(panel, QR_SETUP_VAR_RESUME_FADE_MS);
    const expandUpMs = animCssMsGet(panel, QR_SETUP_VAR_RESUME_EXPAND_UP_MS);
    const expandFullMs = animCssMsGet(panel, QR_SETUP_VAR_RESUME_EXPAND_FULL_MS);
    const expandExtensionMs = animCssMsGet(panel, QR_SETUP_VAR_RESUME_EXPAND_EXTENSION_MS);
    const dotsFadeInMs = animCssMsGet(panel, QR_SETUP_VAR_RESUME_DOTS_FADE_IN_MS);
    const dotsRunMs = animCssMsGet(panel, QR_SETUP_VAR_RESUME_DOTS_RUN_MS);
    const dotsFadeOutMs = animCssMsGet(panel, QR_SETUP_VAR_RESUME_DOTS_FADE_OUT_MS);
    const resultDrawMs = animCssMsGet(panel, QR_SETUP_VAR_RESUME_RESULT_DRAW_MS);
    const resultFadeOutMs = animCssMsGet(panel, QR_SETUP_VAR_RESUME_RESULT_FADE_OUT_MS);
    const shrinkToFullMs = animCssMsGet(panel, QR_SETUP_VAR_RESUME_SHRINK_TO_FULL_MS);
    const shrinkFullMs = animCssMsGet(panel, QR_SETUP_VAR_RESUME_SHRINK_FULL_MS);
    const timeoutBufferMs = animCssMsGet(
      panel,
      QR_SETUP_VAR_ANIMATION_TIMEOUT_BUFFER_MS,
    );
    const circleDuration = Math.round(resultDrawMs * 0.45);
    const markDuration = resultDrawMs - circleDuration;

    panel.classList.add(QR_SETUP_RESUME_RUNNING_CLASS);

    [loadingStatus, successStatus, errorStatus].forEach((status) => {
      status.classList.add(QR_SETUP_HIDDEN_CLASS);
      status.classList.remove(
        QR_SETUP_RESUME_DOTS_FADE_IN_CLASS,
        QR_SETUP_RESUME_DOTS_FADE_OUT_CLASS,
        QR_SETUP_RESUME_DOTS_RUN_CLASS,
        QR_SETUP_RESUME_RESULT_DRAW_CLASS,
        QR_SETUP_RESUME_RESULT_FADE_OUT_CLASS,
        "is-animating",
        "is-drawn",
      );
    });

    panel.classList.add(QR_SETUP_RESUME_FADE_CLASS);
    await animDelay(resumeFadeMs);
    panel.classList.remove(QR_SETUP_RESUME_FADE_CLASS);

    if (runId !== QR_SETUP_RESUME_ANIMATION_RUN_ID.value) {
      return false;
    }

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
    content.style.setProperty(QR_SETUP_VAR_RESUME_EXTENSION_TOP, `${layout.extensionTop}px`);
    content.style.setProperty(QR_SETUP_VAR_RESUME_EXTENSION_LEFT, `${layout.extensionLeft}px`);
    content.style.setProperty(QR_SETUP_VAR_RESUME_EXTENSION_WIDTH, `${layout.extensionWidth}px`);
    content.style.setProperty(QR_SETUP_VAR_RESUME_EXTENSION_HEIGHT, `${layout.extensionHeight}px`);
    content.style.setProperty(QR_SETUP_VAR_RESUME_RESTORE_TOP, `${layout.originTop}px`);
    content.style.setProperty(QR_SETUP_VAR_RESUME_RESTORE_LEFT, `${layout.originLeft}px`);
    content.style.setProperty(QR_SETUP_VAR_RESUME_RESTORE_WIDTH, `${layout.originWidth}px`);
    content.style.setProperty(QR_SETUP_VAR_RESUME_RESTORE_HEIGHT, `${layout.originHeight}px`);
    content.classList.add(QR_SETUP_RESUME_ABSOLUTE_CLASS);

    await animFrameWait();

    content.classList.add(QR_SETUP_RESUME_EXPAND_UP_CLASS);
    await animAnimationEndWait(
      content,
      "signInExpandUp",
      expandUpMs + timeoutBufferMs,
    );
    content.style.setProperty(QR_SETUP_VAR_RESUME_ORIGIN_TOP, `${layout.expandUpTop}px`);
    content.style.setProperty(QR_SETUP_VAR_RESUME_ORIGIN_LEFT, `${layout.expandUpLeft}px`);
    content.style.setProperty(QR_SETUP_VAR_RESUME_ORIGIN_WIDTH, `${layout.expandUpWidth}px`);
    content.style.setProperty(QR_SETUP_VAR_RESUME_ORIGIN_HEIGHT, `${layout.expandUpHeight}px`);
    content.classList.remove(QR_SETUP_RESUME_EXPAND_UP_CLASS);

    if (runId !== QR_SETUP_RESUME_ANIMATION_RUN_ID.value) {
      return false;
    }

    await animFrameWait();

    content.classList.add(QR_SETUP_RESUME_EXPAND_FULL_CLASS);
    await animAnimationEndWait(
      content,
      "signInExpandFull",
      expandFullMs + timeoutBufferMs,
    );
    content.style.setProperty(QR_SETUP_VAR_RESUME_ORIGIN_TOP, `${layout.fullTop}px`);
    content.style.setProperty(QR_SETUP_VAR_RESUME_ORIGIN_LEFT, `${layout.fullLeft}px`);
    content.style.setProperty(QR_SETUP_VAR_RESUME_ORIGIN_WIDTH, `${layout.fullWidth}px`);
    content.style.setProperty(QR_SETUP_VAR_RESUME_ORIGIN_HEIGHT, `${layout.fullHeight}px`);
    content.classList.remove(QR_SETUP_RESUME_EXPAND_FULL_CLASS);

    if (runId !== QR_SETUP_RESUME_ANIMATION_RUN_ID.value) {
      return false;
    }

    await animFrameWait();

    content.classList.add(QR_SETUP_RESUME_EXPAND_EXTENSION_CLASS);
    await animAnimationEndWait(
      content,
      "signInExpandExtension",
      expandExtensionMs + timeoutBufferMs,
    );
    content.style.setProperty(QR_SETUP_VAR_RESUME_ORIGIN_TOP, `${layout.extensionTop}px`);
    content.style.setProperty(QR_SETUP_VAR_RESUME_ORIGIN_LEFT, `${layout.extensionLeft}px`);
    content.style.setProperty(QR_SETUP_VAR_RESUME_ORIGIN_WIDTH, `${layout.extensionWidth}px`);
    content.style.setProperty(QR_SETUP_VAR_RESUME_ORIGIN_HEIGHT, `${layout.extensionHeight}px`);
    content.classList.remove(QR_SETUP_RESUME_EXPAND_EXTENSION_CLASS);

    if (runId !== QR_SETUP_RESUME_ANIMATION_RUN_ID.value) {
      return false;
    }

    loadingStatus.classList.remove(QR_SETUP_HIDDEN_CLASS);
    loadingStatus.classList.add(QR_SETUP_RESUME_DOTS_FADE_IN_CLASS);
    await animAnimationEndWait(
      loadingStatus,
      "qrSetupStatusFadeIn",
      dotsFadeInMs + timeoutBufferMs,
    );
    loadingStatus.classList.remove(QR_SETUP_RESUME_DOTS_FADE_IN_CLASS);
    loadingStatus.classList.add(QR_SETUP_RESUME_DOTS_RUN_CLASS);

    if (runId !== QR_SETUP_RESUME_ANIMATION_RUN_ID.value) {
      return false;
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

    content.classList.add(QR_SETUP_RESUME_SHRINK_TO_FULL_CLASS);
    await animAnimationEndWait(
      content,
      "signInShrinkToFull",
      shrinkToFullMs + timeoutBufferMs,
    );
    content.style.setProperty(QR_SETUP_VAR_RESUME_ORIGIN_TOP, `${layout.fullTop}px`);
    content.style.setProperty(QR_SETUP_VAR_RESUME_ORIGIN_LEFT, `${layout.fullLeft}px`);
    content.style.setProperty(QR_SETUP_VAR_RESUME_ORIGIN_WIDTH, `${layout.fullWidth}px`);
    content.style.setProperty(QR_SETUP_VAR_RESUME_ORIGIN_HEIGHT, `${layout.fullHeight}px`);
    content.classList.remove(QR_SETUP_RESUME_SHRINK_TO_FULL_CLASS);

    if (runId !== QR_SETUP_RESUME_ANIMATION_RUN_ID.value) {
      return false;
    }

    await animFrameWait();

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
