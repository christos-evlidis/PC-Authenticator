import { animAnimationEndWait } from "../../../../../utils/utility-animation.js";
import { animCssMsGet } from "../../../../../utils/utility-animation.js";
import { animFrameMetricsGet } from "../../../../../utils/utility-animation.js";
import { animFrameWait } from "../../../../../utils/utility-animation.js";
import { animPhaseReset } from "../../../../../utils/utility-animation.js";

import { INTRO_FRAME_SELECTOR } from "../../constants.js";
import { INTRO_HEADER_SELECTOR } from "../../constants.js";
import { INTRO_OVERLAY_SELECTOR } from "../../constants.js";
import { INTRO_ROOT_SELECTOR } from "../../constants.js";
import { INTRO_SHRINK_HEADER_CLASS } from "../../constants.js";
import { INTRO_VAR_ANIMATION_TIMEOUT_BUFFER_MS } from "../../constants.js";
import { INTRO_VAR_FROM_HEIGHT } from "../../constants.js";
import { INTRO_VAR_FROM_LEFT } from "../../constants.js";
import { INTRO_VAR_FROM_TOP } from "../../constants.js";
import { INTRO_VAR_FROM_WIDTH } from "../../constants.js";
import { INTRO_VAR_HEIGHT } from "../../constants.js";
import { INTRO_VAR_LEFT } from "../../constants.js";
import { INTRO_VAR_SHRINK_HEADER_MS } from "../../constants.js";
import { INTRO_VAR_TOP } from "../../constants.js";
import { INTRO_VAR_TO_HEIGHT } from "../../constants.js";
import { INTRO_VAR_TO_LEFT } from "../../constants.js";
import { INTRO_VAR_TO_TOP } from "../../constants.js";
import { INTRO_VAR_TO_WIDTH } from "../../constants.js";
import { INTRO_VAR_WIDTH } from "../../constants.js";

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

export { loadAnimationShrinkHeader };
