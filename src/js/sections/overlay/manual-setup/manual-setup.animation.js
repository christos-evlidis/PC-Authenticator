import { animAnimationEndWait, animCssMsGet, animDelay, animFrameWait, animPhaseReset, animTransitionEndWait } from "../../../../utils/utility-animation.js";
import { manualSetupDomGet } from "./manual-setup.dom.js";
import { manualSetupStateSet, manualSetupStateRunIdNext, manualSetupStateRunIdGet } from "./manual-setup.state.js";
import {
  MANUAL_SETUP_ACTIVE_CLASS,
  MANUAL_SETUP_HEADER_BTN_ACTIVE_CLASS,
  MANUAL_SETUP_OPEN_CLASS,
  MANUAL_SETUP_PANEL_BACKDROP_CLOSING_CLASS,
  MANUAL_SETUP_PANEL_CLOSING_CLASS,
  MANUAL_SETUP_PANEL_OPENING_CLASS,
  MANUAL_SETUP_PANEL_OPEN_CLASS,
  MANUAL_SETUP_SUBMITTING_CLASS,
  MANUAL_SETUP_VAR_ANIMATION_TIMEOUT_BUFFER_MS,
  MANUAL_SETUP_VAR_BLUR_MS,
  MANUAL_SETUP_VAR_SLIDE_MS,
  MANUAL_SETUP_HIDDEN_CLASS,
  MANUAL_SETUP_SUBMIT_LOCKED_CLASS,
  MANUAL_SETUP_SUBMIT_FADE_CLASS,
  MANUAL_SETUP_SUBMIT_RESTORE_FADE_CLASS,
  MANUAL_SETUP_SUBMIT_FADE_SELECTORS,
  MANUAL_SETUP_SUBMIT_CONTENT_PHASE_CLASSES,
  MANUAL_SETUP_SUBMIT_LAYOUT_VARS,
  MANUAL_SETUP_SUBMIT_RUNNING_CLASS,
  MANUAL_SETUP_VAR_SUBMIT_FADE_MS,
  MANUAL_SETUP_VAR_SUBMIT_EXPAND_UP_MS,
  MANUAL_SETUP_VAR_SUBMIT_EXPAND_FULL_MS,
  MANUAL_SETUP_VAR_SUBMIT_EXPAND_EXTENSION_MS,
  MANUAL_SETUP_VAR_SUBMIT_DOTS_FADE_IN_MS,
  MANUAL_SETUP_VAR_SUBMIT_DOTS_RUN_MS,
  MANUAL_SETUP_VAR_SUBMIT_DOTS_FADE_OUT_MS,
  MANUAL_SETUP_VAR_SUBMIT_RESULT_DRAW_MS,
  MANUAL_SETUP_VAR_SUBMIT_RESULT_FADE_OUT_MS,
  MANUAL_SETUP_VAR_SUBMIT_SHRINK_TO_FULL_MS,
  MANUAL_SETUP_VAR_SUBMIT_SHRINK_FULL_MS,
  MANUAL_SETUP_VAR_SUBMIT_ORIGIN_TOP,
  MANUAL_SETUP_VAR_SUBMIT_ORIGIN_LEFT,
  MANUAL_SETUP_VAR_SUBMIT_ORIGIN_WIDTH,
  MANUAL_SETUP_VAR_SUBMIT_ORIGIN_HEIGHT,
  MANUAL_SETUP_VAR_SUBMIT_EXPAND_TOP,
  MANUAL_SETUP_VAR_SUBMIT_EXPAND_LEFT,
  MANUAL_SETUP_VAR_SUBMIT_EXPAND_WIDTH,
  MANUAL_SETUP_VAR_SUBMIT_EXPAND_HEIGHT,
  MANUAL_SETUP_VAR_SUBMIT_FULL_TOP,
  MANUAL_SETUP_VAR_SUBMIT_FULL_LEFT,
  MANUAL_SETUP_VAR_SUBMIT_FULL_WIDTH,
  MANUAL_SETUP_VAR_SUBMIT_FULL_HEIGHT,
  MANUAL_SETUP_VAR_SUBMIT_EXTENSION_TOP,
  MANUAL_SETUP_VAR_SUBMIT_EXTENSION_LEFT,
  MANUAL_SETUP_VAR_SUBMIT_EXTENSION_WIDTH,
  MANUAL_SETUP_VAR_SUBMIT_EXTENSION_HEIGHT,
  MANUAL_SETUP_VAR_SUBMIT_RESTORE_TOP,
  MANUAL_SETUP_VAR_SUBMIT_RESTORE_LEFT,
  MANUAL_SETUP_VAR_SUBMIT_RESTORE_WIDTH,
  MANUAL_SETUP_VAR_SUBMIT_RESTORE_HEIGHT,
  MANUAL_SETUP_SUBMIT_ABSOLUTE_CLASS,
  MANUAL_SETUP_SUBMIT_EXPAND_UP_CLASS,
  MANUAL_SETUP_SUBMIT_EXPAND_FULL_CLASS,
  MANUAL_SETUP_SUBMIT_EXPAND_EXTENSION_CLASS,
  MANUAL_SETUP_SUBMIT_DOTS_FADE_IN_CLASS,
  MANUAL_SETUP_SUBMIT_DOTS_RUN_CLASS,
  MANUAL_SETUP_SUBMIT_DOTS_FADE_OUT_CLASS,
  MANUAL_SETUP_SUBMIT_RESULT_DRAW_CLASS,
  MANUAL_SETUP_SUBMIT_RESULT_FADE_OUT_CLASS,
  MANUAL_SETUP_STATUS_ICON_MARK_SELECTOR,
  MANUAL_SETUP_SUBMIT_SHRINK_TO_FULL_CLASS,
  MANUAL_SETUP_SUBMIT_SHRINK_FULL_CLASS,
} from "../../../const/const.manual-setup.js";

async function manualSetupAnimationOpen() {
  const runId = manualSetupStateRunIdNext("panel");
  const dom = manualSetupDomGet();
  const { root, panel, openBtns } = dom;
  if (!root || !panel) {
    return;
  }
  root.classList.remove(
    MANUAL_SETUP_PANEL_OPENING_CLASS,
    MANUAL_SETUP_PANEL_OPEN_CLASS,
    MANUAL_SETUP_PANEL_CLOSING_CLASS,
    MANUAL_SETUP_PANEL_BACKDROP_CLOSING_CLASS,
  );
  panel.classList.remove(
    MANUAL_SETUP_PANEL_OPENING_CLASS,
    MANUAL_SETUP_PANEL_OPEN_CLASS,
    MANUAL_SETUP_PANEL_CLOSING_CLASS,
  );
  try {
    openBtns.forEach((btn) => {
      btn.classList.toggle(MANUAL_SETUP_HEADER_BTN_ACTIVE_CLASS, true);
    });
    root.classList.add(MANUAL_SETUP_ACTIVE_CLASS);
    root.classList.add(MANUAL_SETUP_OPEN_CLASS);
    root.classList.add(MANUAL_SETUP_PANEL_OPENING_CLASS);
    await animFrameWait();
    if (runId !== manualSetupStateRunIdGet("panel")) {
      return;
    }
    root.classList.add(MANUAL_SETUP_PANEL_OPEN_CLASS);
    await animTransitionEndWait(
      panel,
      "transform",
      animCssMsGet(root, MANUAL_SETUP_VAR_SLIDE_MS)
        + animCssMsGet(root, MANUAL_SETUP_VAR_BLUR_MS)
        + animCssMsGet(root, MANUAL_SETUP_VAR_ANIMATION_TIMEOUT_BUFFER_MS),
    );
  } finally {
    if (runId === manualSetupStateRunIdGet("panel")) {
      root.classList.remove(MANUAL_SETUP_PANEL_OPENING_CLASS);
    }
  }
}

async function manualSetupAnimationClose() {
  const runId = manualSetupStateRunIdNext("panel");
  const dom = manualSetupDomGet();
  const { root, panel, backdrop, openBtns } = dom;
  if (!root || !panel) {
    return;
  }
  try {
    openBtns.forEach((btn) => {
      btn.classList.toggle(MANUAL_SETUP_HEADER_BTN_ACTIVE_CLASS, false);
    });
    root.classList.add(MANUAL_SETUP_PANEL_CLOSING_CLASS);
    await animTransitionEndWait(
      panel,
      "transform",
      animCssMsGet(root, MANUAL_SETUP_VAR_SLIDE_MS)
        + animCssMsGet(root, MANUAL_SETUP_VAR_ANIMATION_TIMEOUT_BUFFER_MS),
    );
    if (runId !== manualSetupStateRunIdGet("panel")) {
      return;
    }
    root.classList.remove(MANUAL_SETUP_PANEL_OPEN_CLASS);
    root.classList.add(MANUAL_SETUP_PANEL_BACKDROP_CLOSING_CLASS);
    await animFrameWait();
    if (runId !== manualSetupStateRunIdGet("panel")) {
      return;
    }
    if (backdrop) {
      await animTransitionEndWait(
        backdrop,
        "opacity",
        animCssMsGet(root, MANUAL_SETUP_VAR_BLUR_MS)
          + animCssMsGet(root, MANUAL_SETUP_VAR_ANIMATION_TIMEOUT_BUFFER_MS),
      );
    }
    if (runId !== manualSetupStateRunIdGet("panel")) {
      return;
    }
    root.classList.remove(MANUAL_SETUP_OPEN_CLASS);
    root.classList.remove(MANUAL_SETUP_ACTIVE_CLASS);
    root.classList.remove(MANUAL_SETUP_SUBMITTING_CLASS);
  } finally {
    if (runId === manualSetupStateRunIdGet("panel")) {
      root.classList.remove(
        MANUAL_SETUP_PANEL_OPENING_CLASS,
        MANUAL_SETUP_PANEL_OPEN_CLASS,
        MANUAL_SETUP_PANEL_CLOSING_CLASS,
        MANUAL_SETUP_PANEL_BACKDROP_CLOSING_CLASS,
      );
      panel.classList.remove(
        MANUAL_SETUP_PANEL_OPENING_CLASS,
        MANUAL_SETUP_PANEL_OPEN_CLASS,
        MANUAL_SETUP_PANEL_CLOSING_CLASS,
      );
    }
  }
}

async function manualSetupAnimationSubmit(resolveSubmit) {
  const runId = manualSetupStateRunIdNext("submit");
  const dom = manualSetupDomGet();
  const {
    root,
    panel,
    content,
    statusLoading,
    statusSuccess,
    statusError,
    statusCircle,
    statusMark,
  } = dom;
  if (
    !root ||
    !panel ||
    !content ||
    !statusLoading ||
    !statusSuccess ||
    !statusError
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
    const overlayRoot = panel.closest(MANUAL_SETUP_ROOT_SELECTOR);
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
    const submitFadeMs = animCssMsGet(panel, MANUAL_SETUP_VAR_SUBMIT_FADE_MS);
    const expandUpMs = animCssMsGet(panel, MANUAL_SETUP_VAR_SUBMIT_EXPAND_UP_MS);
    const expandFullMs = animCssMsGet(panel, MANUAL_SETUP_VAR_SUBMIT_EXPAND_FULL_MS);
    const expandExtensionMs = animCssMsGet(panel, MANUAL_SETUP_VAR_SUBMIT_EXPAND_EXTENSION_MS);
    const dotsFadeInMs = animCssMsGet(panel, MANUAL_SETUP_VAR_SUBMIT_DOTS_FADE_IN_MS);
    const dotsRunMs = animCssMsGet(panel, MANUAL_SETUP_VAR_SUBMIT_DOTS_RUN_MS);
    const dotsFadeOutMs = animCssMsGet(panel, MANUAL_SETUP_VAR_SUBMIT_DOTS_FADE_OUT_MS);
    const resultDrawMs = animCssMsGet(panel, MANUAL_SETUP_VAR_SUBMIT_RESULT_DRAW_MS);
    const resultFadeOutMs = animCssMsGet(panel, MANUAL_SETUP_VAR_SUBMIT_RESULT_FADE_OUT_MS);
    const shrinkToFullMs = animCssMsGet(panel, MANUAL_SETUP_VAR_SUBMIT_SHRINK_TO_FULL_MS);
    const shrinkFullMs = animCssMsGet(panel, MANUAL_SETUP_VAR_SUBMIT_SHRINK_FULL_MS);
    const timeoutBufferMs = animCssMsGet(panel, MANUAL_SETUP_VAR_ANIMATION_TIMEOUT_BUFFER_MS);
    const circleDuration = Math.round(resultDrawMs * 0.45);
    const markDuration = resultDrawMs - circleDuration;
    panel.classList.add(MANUAL_SETUP_SUBMIT_RUNNING_CLASS);
    [statusLoading, statusSuccess, statusError].forEach((status) => {
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
    if (runId !== manualSetupStateRunIdGet("submit")) {
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
    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_EXTENSION_TOP, `${layout.extensionTop}px`);
    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_EXTENSION_LEFT, `${layout.extensionLeft}px`);
    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_EXTENSION_WIDTH, `${layout.extensionWidth}px`);
    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_EXTENSION_HEIGHT, `${layout.extensionHeight}px`);
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
    if (runId !== manualSetupStateRunIdGet("submit")) {
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
    if (runId !== manualSetupStateRunIdGet("submit")) {
      return false;
    }
    await animFrameWait();
    content.classList.add(MANUAL_SETUP_SUBMIT_EXPAND_EXTENSION_CLASS);
    await animAnimationEndWait(
      content,
      "signInExpandExtension",
      expandExtensionMs + timeoutBufferMs,
    );
    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_ORIGIN_TOP, `${layout.extensionTop}px`);
    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_ORIGIN_LEFT, `${layout.extensionLeft}px`);
    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_ORIGIN_WIDTH, `${layout.extensionWidth}px`);
    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_ORIGIN_HEIGHT, `${layout.extensionHeight}px`);
    content.classList.remove(MANUAL_SETUP_SUBMIT_EXPAND_EXTENSION_CLASS);
    if (runId !== manualSetupStateRunIdGet("submit")) {
      return false;
    }
    statusLoading.classList.remove(MANUAL_SETUP_HIDDEN_CLASS);
    statusLoading.classList.add(MANUAL_SETUP_SUBMIT_DOTS_FADE_IN_CLASS);
    await animAnimationEndWait(
      statusLoading,
      "manualSetupStatusFadeIn",
      dotsFadeInMs + timeoutBufferMs,
    );
    statusLoading.classList.remove(MANUAL_SETUP_SUBMIT_DOTS_FADE_IN_CLASS);
    statusLoading.classList.add(MANUAL_SETUP_SUBMIT_DOTS_RUN_CLASS);
    if (runId !== manualSetupStateRunIdGet("submit")) {
      return false;
    }
    const [, resultIsSuccess] = await Promise.all([
      animDelay(dotsRunMs),
      submitPromise,
    ]);
    if (runId !== manualSetupStateRunIdGet("submit")) {
      return false;
    }
    statusLoading.classList.remove(MANUAL_SETUP_SUBMIT_DOTS_RUN_CLASS);
    statusLoading.classList.add(MANUAL_SETUP_SUBMIT_DOTS_FADE_OUT_CLASS);
    await animAnimationEndWait(
      statusLoading,
      "manualSetupStatusFadeOut",
      dotsFadeOutMs + timeoutBufferMs,
    );
    statusLoading.classList.remove(MANUAL_SETUP_SUBMIT_DOTS_FADE_OUT_CLASS);
    statusLoading.classList.add(MANUAL_SETUP_HIDDEN_CLASS);
    if (runId !== manualSetupStateRunIdGet("submit")) {
      return false;
    }
    const resultStatus = resultIsSuccess ? statusSuccess : statusError;
    const circle = statusCircle;
    const marks = statusMark ? [statusMark] : [...resultStatus.querySelectorAll(MANUAL_SETUP_STATUS_ICON_MARK_SELECTOR)];
    resultStatus.classList.remove(MANUAL_SETUP_HIDDEN_CLASS);
    resultStatus.classList.add(MANUAL_SETUP_SUBMIT_RESULT_DRAW_CLASS, "is-animating");
    if (circle) {
      await animAnimationEndWait(
        circle,
        "manualSetupStatusCircleDraw",
        circleDuration + timeoutBufferMs,
      );
    }
    if (runId !== manualSetupStateRunIdGet("submit")) {
      return false;
    }
    await Promise.all(
      marks.map((mark) =>
        animAnimationEndWait(mark, "manualSetupStatusMarkDraw", markDuration + timeoutBufferMs),
      ),
    );
    if (runId !== manualSetupStateRunIdGet("submit")) {
      return false;
    }
    resultStatus.classList.remove("is-animating");
    resultStatus.classList.add("is-drawn");
    resultStatus.classList.add(MANUAL_SETUP_SUBMIT_RESULT_FADE_OUT_CLASS);
    await animAnimationEndWait(
      resultStatus,
      "manualSetupStatusFadeOut",
      resultFadeOutMs + timeoutBufferMs,
    );
    resultStatus.classList.remove(
      MANUAL_SETUP_SUBMIT_RESULT_DRAW_CLASS,
      MANUAL_SETUP_SUBMIT_RESULT_FADE_OUT_CLASS,
      "is-drawn",
    );
    resultStatus.classList.add(MANUAL_SETUP_HIDDEN_CLASS);
    if (runId !== manualSetupStateRunIdGet("submit")) {
      return false;
    }
    content.classList.add(MANUAL_SETUP_SUBMIT_SHRINK_TO_FULL_CLASS);
    await animAnimationEndWait(
      content,
      "signInShrinkToFull",
      shrinkToFullMs + timeoutBufferMs,
    );
    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_ORIGIN_TOP, `${layout.fullTop}px`);
    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_ORIGIN_LEFT, `${layout.fullLeft}px`);
    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_ORIGIN_WIDTH, `${layout.fullWidth}px`);
    content.style.setProperty(MANUAL_SETUP_VAR_SUBMIT_ORIGIN_HEIGHT, `${layout.fullHeight}px`);
    content.classList.remove(MANUAL_SETUP_SUBMIT_SHRINK_TO_FULL_CLASS);
    if (runId !== manualSetupStateRunIdGet("submit")) {
      return false;
    }
    await animFrameWait();
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
    if (runId === manualSetupStateRunIdGet("submit")) {
      manualSetupStateSet({ isSubmitting: false });
      root.classList.toggle(MANUAL_SETUP_SUBMIT_LOCKED_CLASS, false);
    }
  }
}

function manualSetupAnimationSubmitFinish() {
  const dom = manualSetupDomGet();
  const {
    root,
    panel,
    content,
    statusLoading,
    statusSuccess,
    statusError,
  } = dom;
  if (content) {
    animPhaseReset(content, ...MANUAL_SETUP_SUBMIT_CONTENT_PHASE_CLASSES);
    MANUAL_SETUP_SUBMIT_LAYOUT_VARS.forEach((layoutVar) => {
      content.style.removeProperty(layoutVar);
    });
  }
  panel?.classList.remove(
    MANUAL_SETUP_SUBMIT_RUNNING_CLASS,
    MANUAL_SETUP_SUBMIT_FADE_CLASS,
    MANUAL_SETUP_SUBMIT_RESTORE_FADE_CLASS,
  );
  panel?.querySelectorAll(MANUAL_SETUP_SUBMIT_FADE_SELECTORS).forEach((element) => {
    element.style.removeProperty("opacity");
    element.style.removeProperty("visibility");
    element.style.removeProperty("pointer-events");
  });
  [statusLoading, statusSuccess, statusError].forEach((status) => {
    if (!status) {
      return;
    }
    status.classList.add(MANUAL_SETUP_HIDDEN_CLASS);
    status.classList.remove(
      MANUAL_SETUP_SUBMIT_DOTS_FADE_IN_CLASS,
      MANUAL_SETUP_SUBMIT_DOTS_RUN_CLASS,
      MANUAL_SETUP_SUBMIT_DOTS_FADE_OUT_CLASS,
      MANUAL_SETUP_SUBMIT_RESULT_DRAW_CLASS,
      MANUAL_SETUP_SUBMIT_RESULT_FADE_OUT_CLASS,
      "is-animating",
      "is-drawn",
    );
  });
  root?.classList.toggle(MANUAL_SETUP_SUBMIT_LOCKED_CLASS, false);
}

export {
  manualSetupAnimationOpen,
  manualSetupAnimationClose,
  manualSetupAnimationSubmit,
  manualSetupAnimationSubmitFinish,
};
