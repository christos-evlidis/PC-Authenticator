import { animCssMsGet } from "../../../utils/utility-animation.js";
import { animFrameWait } from "../../../utils/utility-animation.js";
import { animTransitionEndWait } from "../../../utils/utility-animation.js";

import { HEADER_CONTENT_PENDING_CLASS } from "../constants.js";
import { HEADER_INTRO_CONTENT_SELECTOR } from "../constants.js";
import { HEADER_ROOT_SELECTOR } from "../constants.js";
import { HEADER_VAR_ANIMATION_TIMEOUT_BUFFER_MS } from "../constants.js";
import { HEADER_VAR_INTRO_FADE_MS } from "../constants.js";

/** Fades out header contents while keeping the shell visible. */
async function headerAnimationFadeOut() {
  const header = document.querySelector(HEADER_ROOT_SELECTOR);
  const content = document.querySelector(HEADER_INTRO_CONTENT_SELECTOR);

  if (!header || !content) {
    return;
  }

  const fadeMs = animCssMsGet(header, HEADER_VAR_INTRO_FADE_MS);
  const timeoutBufferMs = animCssMsGet(header, HEADER_VAR_ANIMATION_TIMEOUT_BUFFER_MS);

  header.classList.add(HEADER_CONTENT_PENDING_CLASS);
  await animFrameWait();
  await animTransitionEndWait(content, "opacity", fadeMs + timeoutBufferMs);
}

/** Restores header contents after a cancelled auth fade. */
async function headerAnimationFadeRestore() {
  const header = document.querySelector(HEADER_ROOT_SELECTOR);
  const content = document.querySelector(HEADER_INTRO_CONTENT_SELECTOR);

  if (!header || !content || !header.classList.contains(HEADER_CONTENT_PENDING_CLASS)) {
    return;
  }

  const fadeMs = animCssMsGet(header, HEADER_VAR_INTRO_FADE_MS);
  const timeoutBufferMs = animCssMsGet(header, HEADER_VAR_ANIMATION_TIMEOUT_BUFFER_MS);

  header.classList.remove(HEADER_CONTENT_PENDING_CLASS);
  await animFrameWait();
  await animTransitionEndWait(content, "opacity", fadeMs + timeoutBufferMs);
}

export { headerAnimationFadeOut };
export { headerAnimationFadeRestore };
