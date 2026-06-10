import { animAnimationEndWait } from "../../../../../utils/utility-animation.js";
import { animCssMsGet } from "../../../../../utils/utility-animation.js";
import { animFrameMetricsGet } from "../../../../../utils/utility-animation.js";
import { animFrameWait } from "../../../../../utils/utility-animation.js";
import { animPhaseReset } from "../../../../../utils/utility-animation.js";

import { INTRO_BODY_SELECTOR } from "../../sequences-const.js";
import { INTRO_FRAME_SELECTOR } from "../../sequences-const.js";
import { INTRO_OVERLAY_SELECTOR } from "../../sequences-const.js";
import { INTRO_ROOT_SELECTOR } from "../../sequences-const.js";
import { INTRO_SHRINK_BODY_CLASS } from "../../sequences-const.js";
import { INTRO_VAR_ANIMATION_TIMEOUT_BUFFER_MS } from "../../sequences-const.js";
import { INTRO_VAR_FROM_HEIGHT } from "../../sequences-const.js";
import { INTRO_VAR_FROM_LEFT } from "../../sequences-const.js";
import { INTRO_VAR_FROM_TOP } from "../../sequences-const.js";
import { INTRO_VAR_FROM_WIDTH } from "../../sequences-const.js";
import { INTRO_VAR_HEIGHT } from "../../sequences-const.js";
import { INTRO_VAR_LEFT } from "../../sequences-const.js";
import { INTRO_VAR_SHRINK_BODY_MS } from "../../sequences-const.js";
import { INTRO_VAR_TOP } from "../../sequences-const.js";
import { INTRO_VAR_TO_HEIGHT } from "../../sequences-const.js";
import { INTRO_VAR_TO_LEFT } from "../../sequences-const.js";
import { INTRO_VAR_TO_TOP } from "../../sequences-const.js";
import { INTRO_VAR_TO_WIDTH } from "../../sequences-const.js";
import { INTRO_VAR_WIDTH } from "../../sequences-const.js";

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

export { loadAnimationShrinkBody };
