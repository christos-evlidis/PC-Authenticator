import { animAnimationEndWait, animCssMsGet, animDelay, animFrameWait, animPhaseReset, animTransitionEndWait } from '../../../utils/utility-animation.js';
import * as QR from './qr-code-setup.constants.js';
import { qrSetupStateSet, qrSetupStateRunIdGet, qrSetupStateRunIdNext } from './qr-code-setup.state.js';
import { qrSetupPanelLockSet } from './qr-code-setup.panel.js';

/** Plays the QR panel close slide and backdrop fade. */
// Executes the animation sequence for closing the QR setup panel.
async function qrSetupAnimationPanelClose() {
  const runId = qrSetupStateRunIdNext("panel");

  const root = document.querySelector(QR.QR_SETUP_ROOT_SELECTOR);
  const panel = document.querySelector(QR.QR_SETUP_PANEL_SELECTOR);
  const backdrop = document.querySelector(QR.QR_SETUP_BACKDROP_SELECTOR);

  if (!root || !panel) {
    return;
  }

  try {
    document.querySelectorAll(QR.QR_SETUP_OPEN_BTN_SELECTOR).forEach((button) => {
      button.classList.toggle(QR.QR_SETUP_HEADER_BTN_ACTIVE_CLASS, false);
    });

    root.classList.add(QR.QR_SETUP_PANEL_CLOSING_CLASS);

    await animTransitionEndWait(
      panel,
      "transform",
      animCssMsGet(root, QR.QR_SETUP_VAR_SLIDE_MS)
        + animCssMsGet(root, QR.QR_SETUP_VAR_ANIMATION_TIMEOUT_BUFFER_MS),
    );

    if (runId !== qrSetupStateRunIdGet("panel")) {
      return;
    }

    root.classList.remove(QR.QR_SETUP_PANEL_OPEN_CLASS);
    root.classList.add(QR.QR_SETUP_PANEL_BACKDROP_CLOSING_CLASS);

    await animFrameWait();

    if (runId !== qrSetupStateRunIdGet("panel")) {
      return;
    }

    if (backdrop) {
      await animTransitionEndWait(
        backdrop,
        "opacity",
        animCssMsGet(root, QR.QR_SETUP_VAR_BLUR_MS)
          + animCssMsGet(root, QR.QR_SETUP_VAR_ANIMATION_TIMEOUT_BUFFER_MS),
      );
    }

    if (runId !== qrSetupStateRunIdGet("panel")) {
      return;
    }

    root.classList.remove(QR.QR_SETUP_OPEN_CLASS);
    root.classList.remove(QR.QR_SETUP_ACTIVE_CLASS);
    root.classList.remove(QR.QR_SETUP_BUSY_CLASS);
  } finally {
    if (runId === qrSetupStateRunIdGet("panel")) {
      root.classList.remove(
        QR.QR_SETUP_PANEL_OPENING_CLASS,
        QR.QR_SETUP_PANEL_OPEN_CLASS,
        QR.QR_SETUP_PANEL_CLOSING_CLASS,
        QR.QR_SETUP_PANEL_BACKDROP_CLOSING_CLASS,
      );
      panel.classList.remove(
        QR.QR_SETUP_PANEL_OPENING_CLASS,
        QR.QR_SETUP_PANEL_OPEN_CLASS,
        QR.QR_SETUP_PANEL_CLOSING_CLASS,
      );
    }
  }
}

/** Plays the QR panel open slide and blur animation. */
// Executes the animation sequence for opening the QR setup panel.
async function qrSetupAnimationPanelOpen() {
  const runId = qrSetupStateRunIdNext("panel");

  const root = document.querySelector(QR.QR_SETUP_ROOT_SELECTOR);
  const panel = document.querySelector(QR.QR_SETUP_PANEL_SELECTOR);

  if (!root || !panel) {
    return;
  }

  root.classList.remove(
    QR.QR_SETUP_PANEL_OPENING_CLASS,
    QR.QR_SETUP_PANEL_OPEN_CLASS,
    QR.QR_SETUP_PANEL_CLOSING_CLASS,
    QR.QR_SETUP_PANEL_BACKDROP_CLOSING_CLASS,
  );
  panel.classList.remove(
    QR.QR_SETUP_PANEL_OPENING_CLASS,
    QR.QR_SETUP_PANEL_OPEN_CLASS,
    QR.QR_SETUP_PANEL_CLOSING_CLASS,
  );

  try {
    document.querySelectorAll(QR.QR_SETUP_OPEN_BTN_SELECTOR).forEach((button) => {
      button.classList.toggle(QR.QR_SETUP_HEADER_BTN_ACTIVE_CLASS, true);
    });
    root.classList.add(QR.QR_SETUP_ACTIVE_CLASS);
    root.classList.add(QR.QR_SETUP_OPEN_CLASS);
    root.classList.add(QR.QR_SETUP_PANEL_OPENING_CLASS);

    await animFrameWait();

    if (runId !== qrSetupStateRunIdGet("panel")) {
      return;
    }

    root.classList.add(QR.QR_SETUP_PANEL_OPEN_CLASS);

    await animTransitionEndWait(
      panel,
      "transform",
      animCssMsGet(root, QR.QR_SETUP_VAR_SLIDE_MS)
        + animCssMsGet(root, QR.QR_SETUP_VAR_BLUR_MS)
        + animCssMsGet(root, QR.QR_SETUP_VAR_ANIMATION_TIMEOUT_BUFFER_MS),
    );
  } finally {
    if (runId === qrSetupStateRunIdGet("panel")) {
      root.classList.remove(QR.QR_SETUP_PANEL_OPENING_CLASS);
    }
  }
}

/** Tears down resume animation state after panel close. */
function qrSetupAnimationResumeFinish() {
  const root = document.querySelector(QR.QR_SETUP_ROOT_SELECTOR);
  const panel = document.querySelector(QR.QR_SETUP_PANEL_SELECTOR);
  const content = document.querySelector(QR.QR_SETUP_CONTENT_SELECTOR);
  const loadingStatus = document.querySelector(QR.QR_SETUP_STATUS_LOADING_SELECTOR);
  const successStatus = document.querySelector(QR.QR_SETUP_STATUS_SUCCESS_SELECTOR);
  const errorStatus = document.querySelector(QR.QR_SETUP_STATUS_ERROR_SELECTOR);

  if (content) {
    animPhaseReset(content, ...QR.QR_SETUP_RESUME_CONTENT_PHASE_CLASSES);
    QR.QR_SETUP_RESUME_LAYOUT_VARS.forEach((layoutVar) => {
      content.style.removeProperty(layoutVar);
    });
  }

  panel?.classList.remove(QR.QR_SETUP_RESUME_RUNNING_CLASS, QR.QR_SETUP_RESUME_FADE_CLASS);
  panel?.querySelectorAll(QR.QR_SETUP_RESUME_FADE_SELECTORS).forEach((element) => {
    element.style.removeProperty("opacity");
    element.style.removeProperty("visibility");
    element.style.removeProperty("pointer-events");
  });

  [loadingStatus, successStatus, errorStatus].forEach((status) => {
    if (!status) {
      return;
    }

    status.classList.add(QR.QR_SETUP_HIDDEN_CLASS);
    status.classList.remove(
      QR.QR_SETUP_RESUME_DOTS_FADE_IN_CLASS,
      QR.QR_SETUP_RESUME_DOTS_RUN_CLASS,
      QR.QR_SETUP_RESUME_DOTS_FADE_OUT_CLASS,
      QR.QR_SETUP_RESUME_RESULT_DRAW_CLASS,
      QR.QR_SETUP_RESUME_RESULT_FADE_OUT_CLASS,
      "is-animating",
      "is-drawn",
    );
  });

  root?.classList.toggle(QR.QR_SETUP_RESUME_LOCKED_CLASS, false);
}


// Executes the resume animation sequence, indicating success or failure.
async function qrSetupAnimationResumeRun(scanResult) {
  const runId = qrSetupStateRunIdNext("resume");

  const root = document.querySelector(QR.QR_SETUP_ROOT_SELECTOR);
  const panel = document.querySelector(QR.QR_SETUP_PANEL_SELECTOR);
  const content = document.querySelector(QR.QR_SETUP_CONTENT_SELECTOR);
  const loadingStatus = document.querySelector(QR.QR_SETUP_STATUS_LOADING_SELECTOR);
  const successStatus = document.querySelector(QR.QR_SETUP_STATUS_SUCCESS_SELECTOR);
  const errorStatus = document.querySelector(QR.QR_SETUP_STATUS_ERROR_SELECTOR);

  if (
    !root ||
    !panel ||
    !content ||
    !loadingStatus ||
    !successStatus ||
    !errorStatus
  ) {
    return scanResult;
  }

  panel.classList.remove(QR.QR_SETUP_RESUME_FADE_CLASS);
  panel.querySelectorAll(QR.QR_SETUP_RESUME_FADE_SELECTORS).forEach((element) => {
    element.style.removeProperty("opacity");
    element.style.removeProperty("visibility");
    element.style.removeProperty("pointer-events");
  });
  animPhaseReset(content, ...QR.QR_SETUP_RESUME_CONTENT_PHASE_CLASSES);
  QR.QR_SETUP_RESUME_LAYOUT_VARS.forEach((layoutVar) => {
    content.style.removeProperty(layoutVar);
  });
  panel.classList.remove(QR.QR_SETUP_RESUME_RUNNING_CLASS);


  root.classList.toggle(QR.QR_SETUP_RESUME_LOCKED_CLASS, true);
  qrSetupPanelLockSet(true);



  try {
    const panelRect = panel.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    const panelStyles = getComputedStyle(panel);
    const panelPaddingTop = Number.parseFloat(panelStyles.paddingTop) || 12;
    const overlayRoot = panel.closest(QR.QR_SETUP_ROOT_SELECTOR);
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

    const resumeFadeMs = animCssMsGet(panel, QR.QR_SETUP_VAR_RESUME_FADE_MS);
    const expandUpMs = animCssMsGet(panel, QR.QR_SETUP_VAR_RESUME_EXPAND_UP_MS);
    const expandFullMs = animCssMsGet(panel, QR.QR_SETUP_VAR_RESUME_EXPAND_FULL_MS);
    const expandExtensionMs = animCssMsGet(panel, QR.QR_SETUP_VAR_RESUME_EXPAND_EXTENSION_MS);
    const dotsFadeInMs = animCssMsGet(panel, QR.QR_SETUP_VAR_RESUME_DOTS_FADE_IN_MS);
    const dotsRunMs = animCssMsGet(panel, QR.QR_SETUP_VAR_RESUME_DOTS_RUN_MS);
    const dotsFadeOutMs = animCssMsGet(panel, QR.QR_SETUP_VAR_RESUME_DOTS_FADE_OUT_MS);
    const resultDrawMs = animCssMsGet(panel, QR.QR_SETUP_VAR_RESUME_RESULT_DRAW_MS);
    const resultFadeOutMs = animCssMsGet(panel, QR.QR_SETUP_VAR_RESUME_RESULT_FADE_OUT_MS);
    const shrinkToFullMs = animCssMsGet(panel, QR.QR_SETUP_VAR_RESUME_SHRINK_TO_FULL_MS);
    const shrinkFullMs = animCssMsGet(panel, QR.QR_SETUP_VAR_RESUME_SHRINK_FULL_MS);
    const timeoutBufferMs = animCssMsGet(
      panel,
      QR.QR_SETUP_VAR_ANIMATION_TIMEOUT_BUFFER_MS,
    );
    const circleDuration = Math.round(resultDrawMs * 0.45);
    const markDuration = resultDrawMs - circleDuration;

    panel.classList.add(QR.QR_SETUP_RESUME_RUNNING_CLASS);

    [loadingStatus, successStatus, errorStatus].forEach((status) => {
      status.classList.add(QR.QR_SETUP_HIDDEN_CLASS);
      status.classList.remove(
        QR.QR_SETUP_RESUME_DOTS_FADE_IN_CLASS,
        QR.QR_SETUP_RESUME_DOTS_FADE_OUT_CLASS,
        QR.QR_SETUP_RESUME_DOTS_RUN_CLASS,
        QR.QR_SETUP_RESUME_RESULT_DRAW_CLASS,
        QR.QR_SETUP_RESUME_RESULT_FADE_OUT_CLASS,
        "is-animating",
        "is-drawn",
      );
    });

    panel.classList.add(QR.QR_SETUP_RESUME_FADE_CLASS);
    await animDelay(resumeFadeMs);
    panel.classList.remove(QR.QR_SETUP_RESUME_FADE_CLASS);

    if (runId !== qrSetupStateRunIdGet("resume")) {
      return false;
    }

    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_ORIGIN_TOP, `${layout.originTop}px`);
    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_ORIGIN_LEFT, `${layout.originLeft}px`);
    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_ORIGIN_WIDTH, `${layout.originWidth}px`);
    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_ORIGIN_HEIGHT, `${layout.originHeight}px`);
    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_EXPAND_TOP, `${layout.expandUpTop}px`);
    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_EXPAND_LEFT, `${layout.expandUpLeft}px`);
    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_EXPAND_WIDTH, `${layout.expandUpWidth}px`);
    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_EXPAND_HEIGHT, `${layout.expandUpHeight}px`);
    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_FULL_TOP, `${layout.fullTop}px`);
    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_FULL_LEFT, `${layout.fullLeft}px`);
    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_FULL_WIDTH, `${layout.fullWidth}px`);
    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_FULL_HEIGHT, `${layout.fullHeight}px`);
    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_EXTENSION_TOP, `${layout.extensionTop}px`);
    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_EXTENSION_LEFT, `${layout.extensionLeft}px`);
    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_EXTENSION_WIDTH, `${layout.extensionWidth}px`);
    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_EXTENSION_HEIGHT, `${layout.extensionHeight}px`);
    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_RESTORE_TOP, `${layout.originTop}px`);
    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_RESTORE_LEFT, `${layout.originLeft}px`);
    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_RESTORE_WIDTH, `${layout.originWidth}px`);
    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_RESTORE_HEIGHT, `${layout.originHeight}px`);
    content.classList.add(QR.QR_SETUP_RESUME_ABSOLUTE_CLASS);

    await animFrameWait();

    content.classList.add(QR.QR_SETUP_RESUME_EXPAND_UP_CLASS);
    await animAnimationEndWait(
      content,
      "signInExpandUp",
      expandUpMs + timeoutBufferMs,
    );
    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_ORIGIN_TOP, `${layout.expandUpTop}px`);
    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_ORIGIN_LEFT, `${layout.expandUpLeft}px`);
    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_ORIGIN_WIDTH, `${layout.expandUpWidth}px`);
    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_ORIGIN_HEIGHT, `${layout.expandUpHeight}px`);
    content.classList.remove(QR.QR_SETUP_RESUME_EXPAND_UP_CLASS);

    if (runId !== qrSetupStateRunIdGet("resume")) {
      return false;
    }

    await animFrameWait();

    content.classList.add(QR.QR_SETUP_RESUME_EXPAND_FULL_CLASS);
    await animAnimationEndWait(
      content,
      "signInExpandFull",
      expandFullMs + timeoutBufferMs,
    );
    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_ORIGIN_TOP, `${layout.fullTop}px`);
    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_ORIGIN_LEFT, `${layout.fullLeft}px`);
    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_ORIGIN_WIDTH, `${layout.fullWidth}px`);
    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_ORIGIN_HEIGHT, `${layout.fullHeight}px`);
    content.classList.remove(QR.QR_SETUP_RESUME_EXPAND_FULL_CLASS);

    if (runId !== qrSetupStateRunIdGet("resume")) {
      return false;
    }

    await animFrameWait();

    content.classList.add(QR.QR_SETUP_RESUME_EXPAND_EXTENSION_CLASS);
    await animAnimationEndWait(
      content,
      "signInExpandExtension",
      expandExtensionMs + timeoutBufferMs,
    );
    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_ORIGIN_TOP, `${layout.extensionTop}px`);
    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_ORIGIN_LEFT, `${layout.extensionLeft}px`);
    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_ORIGIN_WIDTH, `${layout.extensionWidth}px`);
    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_ORIGIN_HEIGHT, `${layout.extensionHeight}px`);
    content.classList.remove(QR.QR_SETUP_RESUME_EXPAND_EXTENSION_CLASS);

    if (runId !== qrSetupStateRunIdGet("resume")) {
      return false;
    }

    loadingStatus.classList.remove(QR.QR_SETUP_HIDDEN_CLASS);
    loadingStatus.classList.add(QR.QR_SETUP_RESUME_DOTS_FADE_IN_CLASS);
    await animAnimationEndWait(
      loadingStatus,
      "qrSetupStatusFadeIn",
      dotsFadeInMs + timeoutBufferMs,
    );
    loadingStatus.classList.remove(QR.QR_SETUP_RESUME_DOTS_FADE_IN_CLASS);
    loadingStatus.classList.add(QR.QR_SETUP_RESUME_DOTS_RUN_CLASS);

    if (runId !== qrSetupStateRunIdGet("resume")) {
      return false;
    }

    await animDelay(dotsRunMs);

    if (runId !== qrSetupStateRunIdGet("resume")) {
      return false;
    }

    loadingStatus.classList.remove(QR.QR_SETUP_RESUME_DOTS_RUN_CLASS);
    loadingStatus.classList.add(QR.QR_SETUP_RESUME_DOTS_FADE_OUT_CLASS);
    await animAnimationEndWait(
      loadingStatus,
      "qrSetupStatusFadeOut",
      dotsFadeOutMs + timeoutBufferMs,
    );
    loadingStatus.classList.remove(QR.QR_SETUP_RESUME_DOTS_FADE_OUT_CLASS);
    loadingStatus.classList.add(QR.QR_SETUP_HIDDEN_CLASS);

    if (runId !== qrSetupStateRunIdGet("resume")) {
      return false;
    }

    const resultStatus = scanResult ? successStatus : errorStatus;
    const circle = resultStatus.querySelector(QR.QR_SETUP_STATUS_ICON_CIRCLE_SELECTOR);
    const marks = [
      ...resultStatus.querySelectorAll(QR.QR_SETUP_STATUS_ICON_MARK_SELECTOR),
    ];

    resultStatus.classList.remove(QR.QR_SETUP_HIDDEN_CLASS);
    resultStatus.classList.add(QR.QR_SETUP_RESUME_RESULT_DRAW_CLASS, "is-animating");

    if (circle) {
      await animAnimationEndWait(
        circle,
        "qrSetupStatusCircleDraw",
        circleDuration + timeoutBufferMs,
      );
    }

    if (runId !== qrSetupStateRunIdGet("resume")) {
      return false;
    }

    await Promise.all(
      marks.map((mark) =>
        animAnimationEndWait(mark, "qrSetupStatusMarkDraw", markDuration + timeoutBufferMs),
      ),
    );

    if (runId !== qrSetupStateRunIdGet("resume")) {
      return false;
    }

    resultStatus.classList.remove("is-animating");
    resultStatus.classList.add("is-drawn");

    resultStatus.classList.add(QR.QR_SETUP_RESUME_RESULT_FADE_OUT_CLASS);
    await animAnimationEndWait(
      resultStatus,
      "qrSetupStatusFadeOut",
      resultFadeOutMs + timeoutBufferMs,
    );
    resultStatus.classList.remove(
      QR.QR_SETUP_RESUME_RESULT_DRAW_CLASS,
      QR.QR_SETUP_RESUME_RESULT_FADE_OUT_CLASS,
      "is-drawn",
    );
    resultStatus.classList.add(QR.QR_SETUP_HIDDEN_CLASS);

    if (runId !== qrSetupStateRunIdGet("resume")) {
      return false;
    }

    content.classList.add(QR.QR_SETUP_RESUME_SHRINK_TO_FULL_CLASS);
    await animAnimationEndWait(
      content,
      "signInShrinkToFull",
      shrinkToFullMs + timeoutBufferMs,
    );
    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_ORIGIN_TOP, `${layout.fullTop}px`);
    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_ORIGIN_LEFT, `${layout.fullLeft}px`);
    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_ORIGIN_WIDTH, `${layout.fullWidth}px`);
    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_ORIGIN_HEIGHT, `${layout.fullHeight}px`);
    content.classList.remove(QR.QR_SETUP_RESUME_SHRINK_TO_FULL_CLASS);

    if (runId !== qrSetupStateRunIdGet("resume")) {
      return false;
    }

    await animFrameWait();

    content.classList.add(QR.QR_SETUP_RESUME_SHRINK_FULL_CLASS);
    await animAnimationEndWait(
      content,
      "signInShrinkFull",
      shrinkFullMs + timeoutBufferMs,
    );
    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_ORIGIN_TOP, `${layout.expandUpTop}px`);
    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_ORIGIN_LEFT, `${layout.expandUpLeft}px`);
    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_ORIGIN_WIDTH, `${layout.expandUpWidth}px`);
    content.style.setProperty(QR.QR_SETUP_VAR_RESUME_ORIGIN_HEIGHT, `${layout.expandUpHeight}px`);
    content.classList.remove(QR.QR_SETUP_RESUME_SHRINK_FULL_CLASS);

    return scanResult;
  } finally {
    if (runId === qrSetupStateRunIdGet("resume")) {
      qrSetupStateSet({ stateScan: false });
      root.classList.toggle(QR.QR_SETUP_RESUME_LOCKED_CLASS, false);
      qrSetupPanelLockSet(false);
    }
  }
}



export { qrSetupAnimationPanelOpen, qrSetupAnimationPanelClose, qrSetupAnimationResumeRun, qrSetupAnimationResumeFinish };

