import { animAnimationEndWait } from "../../../../utils/utility-animation.js";
import { animCssMsGet } from "../../../../utils/utility-animation.js";
import { animDelay } from "../../../../utils/utility-animation.js";
import { animFrameMetricsGet } from "../../../../utils/utility-animation.js";
import { animFrameWait } from "../../../../utils/utility-animation.js";
import { animPhaseReset } from "../../../../utils/utility-animation.js";
import { bodyAnimationReset } from "../../../../sections/shell/body/body-index.js";
import { bodyAnimationStart } from "../../../../sections/shell/body/body-index.js";
import { headerAnimationStart } from "../../../../sections/shell/header/header-index.js";
import { searchAnimationPrepare } from "../../../../sections/shell/search/search-index.js";
import { searchAnimationRun } from "../../../../sections/shell/search/search-index.js";
import { loadAnimationFinish } from "./finish.js";
import { loadAnimationInstant } from "./instant.js";
import { loadAnimationReset } from "./reset.js";

import {
  INTRO_BODY_SELECTOR,
  INTRO_FRAME_SELECTOR,
  INTRO_HEADER_SELECTOR,
  INTRO_LOGO_FADE_CLASS,
  INTRO_OVERLAY_SELECTOR,
  INTRO_ROOT_SELECTOR,
  INTRO_ROUNDED_CLASS,
  INTRO_SEARCH_SELECTOR,
  INTRO_SHRINK_BODY_CLASS,
  INTRO_SHRINK_FRAME_CLASS,
  INTRO_SHRINK_HEADER_CLASS,
  INTRO_SHRINK_SEARCH_CLASS,
  INTRO_VAR_ANIMATION_TIMEOUT_BUFFER_MS,
  INTRO_VAR_FROM_HEIGHT,
  INTRO_VAR_FROM_LEFT,
  INTRO_VAR_FROM_TOP,
  INTRO_VAR_FROM_WIDTH,
  INTRO_VAR_HEIGHT,
  INTRO_VAR_LEFT,
  INTRO_VAR_LOGO_HOLD_MS,
  INTRO_VAR_SHRINK_BODY_MS,
  INTRO_VAR_SHRINK_FRAME_MS,
  INTRO_VAR_SHRINK_HEADER_MS,
  INTRO_VAR_SHRINK_SEARCH_MS,
  INTRO_VAR_TOP,
  INTRO_VAR_TO_HEIGHT,
  INTRO_VAR_TO_LEFT,
  INTRO_VAR_TO_TOP,
  INTRO_VAR_TO_WIDTH,
  INTRO_VAR_WIDTH,
} from "../../../../const/const.sequences.js";

async function loadAnimationStart(isSignedIn, options = {}) {
  const { skipIntro = false } = options;
  const intro = document.querySelector(INTRO_ROOT_SELECTOR);

  if (!intro) {
    return;
  }

  if (skipIntro) {
    loadAnimationInstant(isSignedIn);
    return;
  }

  loadAnimationReset();
  await loadAnimationLogoHold();
  bodyAnimationReset();

  await loadAnimationShrinkFrame();
  await loadAnimationShrinkHeader();
  await headerAnimationStart();

  if (isSignedIn) {
    searchAnimationPrepare();
    await loadAnimationShrinkSearch();
    await searchAnimationRun();
  }

  await loadAnimationShrinkBody();
  loadAnimationFinish();
  await bodyAnimationStart();
}

async function loadAnimationLogoHold() {
  const intro = document.querySelector(INTRO_ROOT_SELECTOR);

  if (!intro) {
    return;
  }

  await animDelay(animCssMsGet(intro, INTRO_VAR_LOGO_HOLD_MS));
}

async function loadAnimationShrinkFrame() {
  const intro = document.querySelector(INTRO_ROOT_SELECTOR);
  const overlay = document.querySelector(INTRO_OVERLAY_SELECTOR);
  const frame = document.querySelector(INTRO_FRAME_SELECTOR);

  if (!intro || !overlay || !frame) {
    return;
  }

  const { padTop, padLeft, padBottom, insetWidth } = animFrameMetricsGet(frame);
  const frameWidth = frame.offsetWidth;
  const frameHeight = frame.offsetHeight;
  const fromLayout = {
    top: 0,
    left: 0,
    width: frameWidth,
    height: frameHeight,
  };
  const toLayout = {
    top: padTop,
    left: padLeft,
    width: insetWidth,
    height: frameHeight - padTop - padBottom,
  };
  const shrinkMs = animCssMsGet(intro, INTRO_VAR_SHRINK_FRAME_MS);
  const timeoutBufferMs = animCssMsGet(intro, INTRO_VAR_ANIMATION_TIMEOUT_BUFFER_MS);

  overlay.style.setProperty(INTRO_VAR_FROM_TOP, `${fromLayout.top}px`);
  overlay.style.setProperty(INTRO_VAR_FROM_LEFT, `${fromLayout.left}px`);
  overlay.style.setProperty(INTRO_VAR_FROM_WIDTH, `${fromLayout.width}px`);
  overlay.style.setProperty(INTRO_VAR_FROM_HEIGHT, `${fromLayout.height}px`);
  overlay.style.setProperty(INTRO_VAR_TO_TOP, `${toLayout.top}px`);
  overlay.style.setProperty(INTRO_VAR_TO_LEFT, `${toLayout.left}px`);
  overlay.style.setProperty(INTRO_VAR_TO_WIDTH, `${toLayout.width}px`);
  overlay.style.setProperty(INTRO_VAR_TO_HEIGHT, `${toLayout.height}px`);
  overlay.style.setProperty(INTRO_VAR_TOP, `${fromLayout.top}px`);
  overlay.style.setProperty(INTRO_VAR_LEFT, `${fromLayout.left}px`);
  overlay.style.setProperty(INTRO_VAR_WIDTH, `${fromLayout.width}px`);
  overlay.style.setProperty(INTRO_VAR_HEIGHT, `${fromLayout.height}px`);

  intro.classList.add(INTRO_LOGO_FADE_CLASS);
  overlay.classList.add(INTRO_SHRINK_FRAME_CLASS);
  await animFrameWait();
  await animAnimationEndWait(overlay, "introShrinkFrame", shrinkMs + timeoutBufferMs);

  animPhaseReset(overlay, INTRO_SHRINK_FRAME_CLASS);
  overlay.classList.add(INTRO_ROUNDED_CLASS);
  overlay.style.setProperty(INTRO_VAR_TOP, `${toLayout.top}px`);
  overlay.style.setProperty(INTRO_VAR_LEFT, `${toLayout.left}px`);
  overlay.style.setProperty(INTRO_VAR_WIDTH, `${toLayout.width}px`);
  overlay.style.setProperty(INTRO_VAR_HEIGHT, `${toLayout.height}px`);
  overlay.style.removeProperty(INTRO_VAR_FROM_TOP);
  overlay.style.removeProperty(INTRO_VAR_FROM_LEFT);
  overlay.style.removeProperty(INTRO_VAR_FROM_WIDTH);
  overlay.style.removeProperty(INTRO_VAR_FROM_HEIGHT);
  overlay.style.removeProperty(INTRO_VAR_TO_TOP);
  overlay.style.removeProperty(INTRO_VAR_TO_LEFT);
  overlay.style.removeProperty(INTRO_VAR_TO_WIDTH);
  overlay.style.removeProperty(INTRO_VAR_TO_HEIGHT);
}

async function loadAnimationShrinkHeader() {
  const intro = document.querySelector(INTRO_ROOT_SELECTOR);
  const overlay = document.querySelector(INTRO_OVERLAY_SELECTOR);
  const frame = document.querySelector(INTRO_FRAME_SELECTOR);
  const header = document.querySelector(INTRO_HEADER_SELECTOR);

  if (!intro || !overlay || !frame || !header) {
    return;
  }

  const { padTop, padLeft, gap, bottomAnchor, insetWidth } = animFrameMetricsGet(frame);
  const frameRect = frame.getBoundingClientRect();
  const headerRect = header.getBoundingClientRect();
  const headerBottom = headerRect.bottom - frameRect.top;
  const toTop = headerBottom + gap;
  const fromLayout = {
    top: Number.parseFloat(overlay.style.getPropertyValue(INTRO_VAR_TOP)) || padTop,
    left: Number.parseFloat(overlay.style.getPropertyValue(INTRO_VAR_LEFT)) || padLeft,
    width: Number.parseFloat(overlay.style.getPropertyValue(INTRO_VAR_WIDTH)) || insetWidth,
    height:
      Number.parseFloat(overlay.style.getPropertyValue(INTRO_VAR_HEIGHT)) ||
      bottomAnchor - padTop,
  };
  const toLayout = {
    top: toTop,
    left: padLeft,
    width: insetWidth,
    height: bottomAnchor - toTop,
  };
  const shrinkMs = animCssMsGet(intro, INTRO_VAR_SHRINK_HEADER_MS);
  const timeoutBufferMs = animCssMsGet(intro, INTRO_VAR_ANIMATION_TIMEOUT_BUFFER_MS);

  overlay.style.setProperty(INTRO_VAR_FROM_TOP, `${fromLayout.top}px`);
  overlay.style.setProperty(INTRO_VAR_FROM_LEFT, `${fromLayout.left}px`);
  overlay.style.setProperty(INTRO_VAR_FROM_WIDTH, `${fromLayout.width}px`);
  overlay.style.setProperty(INTRO_VAR_FROM_HEIGHT, `${fromLayout.height}px`);
  overlay.style.setProperty(INTRO_VAR_TO_TOP, `${toLayout.top}px`);
  overlay.style.setProperty(INTRO_VAR_TO_LEFT, `${toLayout.left}px`);
  overlay.style.setProperty(INTRO_VAR_TO_WIDTH, `${toLayout.width}px`);
  overlay.style.setProperty(INTRO_VAR_TO_HEIGHT, `${toLayout.height}px`);
  overlay.style.setProperty(INTRO_VAR_TOP, `${fromLayout.top}px`);
  overlay.style.setProperty(INTRO_VAR_LEFT, `${fromLayout.left}px`);
  overlay.style.setProperty(INTRO_VAR_WIDTH, `${fromLayout.width}px`);
  overlay.style.setProperty(INTRO_VAR_HEIGHT, `${fromLayout.height}px`);

  overlay.classList.add(INTRO_SHRINK_HEADER_CLASS);
  await animFrameWait();
  await animAnimationEndWait(overlay, "introShrinkHeader", shrinkMs + timeoutBufferMs);

  animPhaseReset(overlay, INTRO_SHRINK_HEADER_CLASS);
  overlay.style.setProperty(INTRO_VAR_TOP, `${toLayout.top}px`);
  overlay.style.setProperty(INTRO_VAR_LEFT, `${toLayout.left}px`);
  overlay.style.setProperty(INTRO_VAR_WIDTH, `${toLayout.width}px`);
  overlay.style.setProperty(INTRO_VAR_HEIGHT, `${toLayout.height}px`);
  overlay.style.removeProperty(INTRO_VAR_FROM_TOP);
  overlay.style.removeProperty(INTRO_VAR_FROM_LEFT);
  overlay.style.removeProperty(INTRO_VAR_FROM_WIDTH);
  overlay.style.removeProperty(INTRO_VAR_FROM_HEIGHT);
  overlay.style.removeProperty(INTRO_VAR_TO_TOP);
  overlay.style.removeProperty(INTRO_VAR_TO_LEFT);
  overlay.style.removeProperty(INTRO_VAR_TO_WIDTH);
  overlay.style.removeProperty(INTRO_VAR_TO_HEIGHT);
}

async function loadAnimationShrinkSearch() {
  const intro = document.querySelector(INTRO_ROOT_SELECTOR);
  const overlay = document.querySelector(INTRO_OVERLAY_SELECTOR);
  const frame = document.querySelector(INTRO_FRAME_SELECTOR);
  const search = document.querySelector(INTRO_SEARCH_SELECTOR);

  if (!intro || !overlay || !frame || !search) {
    return;
  }

  const { padTop, padLeft, gap, bottomAnchor, insetWidth } = animFrameMetricsGet(frame);
  const frameRect = frame.getBoundingClientRect();
  const searchRect = search.getBoundingClientRect();
  const searchBottom = searchRect.bottom - frameRect.top;
  const toTop = searchBottom + gap;
  const fromLayout = {
    top: Number.parseFloat(overlay.style.getPropertyValue(INTRO_VAR_TOP)) || padTop,
    left: Number.parseFloat(overlay.style.getPropertyValue(INTRO_VAR_LEFT)) || padLeft,
    width: Number.parseFloat(overlay.style.getPropertyValue(INTRO_VAR_WIDTH)) || insetWidth,
    height:
      Number.parseFloat(overlay.style.getPropertyValue(INTRO_VAR_HEIGHT)) ||
      bottomAnchor - padTop,
  };
  const toLayout = {
    top: toTop,
    left: padLeft,
    width: insetWidth,
    height: bottomAnchor - toTop,
  };
  const shrinkMs = animCssMsGet(intro, INTRO_VAR_SHRINK_SEARCH_MS);
  const timeoutBufferMs = animCssMsGet(intro, INTRO_VAR_ANIMATION_TIMEOUT_BUFFER_MS);

  overlay.style.setProperty(INTRO_VAR_FROM_TOP, `${fromLayout.top}px`);
  overlay.style.setProperty(INTRO_VAR_FROM_LEFT, `${fromLayout.left}px`);
  overlay.style.setProperty(INTRO_VAR_FROM_WIDTH, `${fromLayout.width}px`);
  overlay.style.setProperty(INTRO_VAR_FROM_HEIGHT, `${fromLayout.height}px`);
  overlay.style.setProperty(INTRO_VAR_TO_TOP, `${toLayout.top}px`);
  overlay.style.setProperty(INTRO_VAR_TO_LEFT, `${toLayout.left}px`);
  overlay.style.setProperty(INTRO_VAR_TO_WIDTH, `${toLayout.width}px`);
  overlay.style.setProperty(INTRO_VAR_TO_HEIGHT, `${toLayout.height}px`);
  overlay.style.setProperty(INTRO_VAR_TOP, `${fromLayout.top}px`);
  overlay.style.setProperty(INTRO_VAR_LEFT, `${fromLayout.left}px`);
  overlay.style.setProperty(INTRO_VAR_WIDTH, `${fromLayout.width}px`);
  overlay.style.setProperty(INTRO_VAR_HEIGHT, `${fromLayout.height}px`);

  overlay.classList.add(INTRO_SHRINK_SEARCH_CLASS);
  await animFrameWait();
  await animAnimationEndWait(overlay, "introShrinkSearch", shrinkMs + timeoutBufferMs);

  animPhaseReset(overlay, INTRO_SHRINK_SEARCH_CLASS);
  overlay.style.setProperty(INTRO_VAR_TOP, `${toLayout.top}px`);
  overlay.style.setProperty(INTRO_VAR_LEFT, `${toLayout.left}px`);
  overlay.style.setProperty(INTRO_VAR_WIDTH, `${toLayout.width}px`);
  overlay.style.setProperty(INTRO_VAR_HEIGHT, `${toLayout.height}px`);
  overlay.style.removeProperty(INTRO_VAR_FROM_TOP);
  overlay.style.removeProperty(INTRO_VAR_FROM_LEFT);
  overlay.style.removeProperty(INTRO_VAR_FROM_WIDTH);
  overlay.style.removeProperty(INTRO_VAR_FROM_HEIGHT);
  overlay.style.removeProperty(INTRO_VAR_TO_TOP);
  overlay.style.removeProperty(INTRO_VAR_TO_LEFT);
  overlay.style.removeProperty(INTRO_VAR_TO_WIDTH);
  overlay.style.removeProperty(INTRO_VAR_TO_HEIGHT);
}

async function loadAnimationShrinkBody() {
  const intro = document.querySelector(INTRO_ROOT_SELECTOR);
  const overlay = document.querySelector(INTRO_OVERLAY_SELECTOR);
  const frame = document.querySelector(INTRO_FRAME_SELECTOR);
  const body = document.querySelector(INTRO_BODY_SELECTOR);

  if (!intro || !overlay || !frame || !body) {
    return;
  }

  const { padTop, padLeft, bottomAnchor, insetWidth } = animFrameMetricsGet(frame);
  const frameRect = frame.getBoundingClientRect();
  const bodyRect = body.getBoundingClientRect();
  const bodyTop = bodyRect.top - frameRect.top;
  const fromLayout = {
    top: Number.parseFloat(overlay.style.getPropertyValue(INTRO_VAR_TOP)) || padTop,
    left: Number.parseFloat(overlay.style.getPropertyValue(INTRO_VAR_LEFT)) || padLeft,
    width: Number.parseFloat(overlay.style.getPropertyValue(INTRO_VAR_WIDTH)) || insetWidth,
    height:
      Number.parseFloat(overlay.style.getPropertyValue(INTRO_VAR_HEIGHT)) ||
      bottomAnchor - padTop,
  };
  const toLayout = {
    top: bodyTop,
    left: padLeft,
    width: insetWidth,
    height: bottomAnchor - bodyTop,
  };
  const shrinkMs = animCssMsGet(intro, INTRO_VAR_SHRINK_BODY_MS);
  const timeoutBufferMs = animCssMsGet(intro, INTRO_VAR_ANIMATION_TIMEOUT_BUFFER_MS);

  overlay.style.setProperty(INTRO_VAR_FROM_TOP, `${fromLayout.top}px`);
  overlay.style.setProperty(INTRO_VAR_FROM_LEFT, `${fromLayout.left}px`);
  overlay.style.setProperty(INTRO_VAR_FROM_WIDTH, `${fromLayout.width}px`);
  overlay.style.setProperty(INTRO_VAR_FROM_HEIGHT, `${fromLayout.height}px`);
  overlay.style.setProperty(INTRO_VAR_TO_TOP, `${toLayout.top}px`);
  overlay.style.setProperty(INTRO_VAR_TO_LEFT, `${toLayout.left}px`);
  overlay.style.setProperty(INTRO_VAR_TO_WIDTH, `${toLayout.width}px`);
  overlay.style.setProperty(INTRO_VAR_TO_HEIGHT, `${toLayout.height}px`);
  overlay.style.setProperty(INTRO_VAR_TOP, `${fromLayout.top}px`);
  overlay.style.setProperty(INTRO_VAR_LEFT, `${fromLayout.left}px`);
  overlay.style.setProperty(INTRO_VAR_WIDTH, `${fromLayout.width}px`);
  overlay.style.setProperty(INTRO_VAR_HEIGHT, `${fromLayout.height}px`);

  overlay.classList.add(INTRO_SHRINK_BODY_CLASS);
  await animFrameWait();
  await animAnimationEndWait(overlay, "introShrinkBody", shrinkMs + timeoutBufferMs);

  animPhaseReset(overlay, INTRO_SHRINK_BODY_CLASS);
  overlay.style.setProperty(INTRO_VAR_TOP, `${toLayout.top}px`);
  overlay.style.setProperty(INTRO_VAR_LEFT, `${toLayout.left}px`);
  overlay.style.setProperty(INTRO_VAR_WIDTH, `${toLayout.width}px`);
  overlay.style.setProperty(INTRO_VAR_HEIGHT, `${toLayout.height}px`);
  overlay.style.removeProperty(INTRO_VAR_FROM_TOP);
  overlay.style.removeProperty(INTRO_VAR_FROM_LEFT);
  overlay.style.removeProperty(INTRO_VAR_FROM_WIDTH);
  overlay.style.removeProperty(INTRO_VAR_FROM_HEIGHT);
  overlay.style.removeProperty(INTRO_VAR_TO_TOP);
  overlay.style.removeProperty(INTRO_VAR_TO_LEFT);
  overlay.style.removeProperty(INTRO_VAR_TO_WIDTH);
  overlay.style.removeProperty(INTRO_VAR_TO_HEIGHT);
}

export { loadAnimationStart };
