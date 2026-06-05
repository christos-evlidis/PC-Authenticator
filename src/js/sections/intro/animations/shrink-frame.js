import { cssMs } from "../../../utils/utility-animation.js";
import { cssPhaseReset } from "../../../utils/utility-animation.js";
import { frameMetrics } from "../../../utils/utility-animation.js";
import { waitForAnimationEnd } from "../../../utils/utility-animation.js";
import { waitForNextFrame } from "../../../utils/utility-animation.js";
import { INTRO_LOGO_FADE_CLASS } from "../constants.js";
import { INTRO_FRAME_SELECTOR } from "../constants.js";
import { INTRO_OVERLAY_SELECTOR } from "../constants.js";
import { INTRO_ROOT_SELECTOR } from "../constants.js";
import { INTRO_ROUNDED_CLASS } from "../constants.js";
import { INTRO_SHRINK_FRAME_CLASS } from "../constants.js";
import { INTRO_VAR_ANIMATION_TIMEOUT_BUFFER_MS } from "../constants.js";
import { INTRO_VAR_FROM_HEIGHT } from "../constants.js";
import { INTRO_VAR_FROM_LEFT } from "../constants.js";
import { INTRO_VAR_FROM_TOP } from "../constants.js";
import { INTRO_VAR_FROM_WIDTH } from "../constants.js";
import { INTRO_VAR_HEIGHT } from "../constants.js";
import { INTRO_VAR_LEFT } from "../constants.js";
import { INTRO_VAR_SHRINK_FRAME_MS } from "../constants.js";
import { INTRO_VAR_TO_HEIGHT } from "../constants.js";
import { INTRO_VAR_TO_LEFT } from "../constants.js";
import { INTRO_VAR_TO_TOP } from "../constants.js";
import { INTRO_VAR_TO_WIDTH } from "../constants.js";
import { INTRO_VAR_TOP } from "../constants.js";
import { INTRO_VAR_WIDTH } from "../constants.js";

/** Shrinks the overlay from all sides until the extension frame padding is visible. */
export async function introAnimationShrinkFrame() {
  const intro = document.querySelector(INTRO_ROOT_SELECTOR);
  const overlay = document.querySelector(INTRO_OVERLAY_SELECTOR);
  const frame = document.querySelector(INTRO_FRAME_SELECTOR);

  if (!intro || !overlay || !frame) {
    return;
  }

  const { padTop, padLeft, padBottom, insetWidth } = frameMetrics(frame);
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
  const shrinkMs = cssMs(intro, INTRO_VAR_SHRINK_FRAME_MS);
  const timeoutBufferMs = cssMs(intro, INTRO_VAR_ANIMATION_TIMEOUT_BUFFER_MS);

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
  await waitForNextFrame();
  await waitForAnimationEnd(overlay, "introShrinkFrame", shrinkMs + timeoutBufferMs);

  cssPhaseReset(overlay, INTRO_SHRINK_FRAME_CLASS);
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
