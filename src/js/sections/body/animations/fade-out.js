import { animCssMsGet } from "../../../utils/utility-animation.js";
import { animFrameWait } from "../../../utils/utility-animation.js";
import { animTransitionEndWait } from "../../../utils/utility-animation.js";

import { BODY_CONTENT_FADE_PENDING_CLASS } from "../constants.js";
import { BODY_ROOT_SELECTOR } from "../constants.js";
import { BODY_VAR_ANIMATION_TIMEOUT_BUFFER_MS } from "../constants.js";
import { BODY_VAR_AUTH_FADE_MS } from "../constants.js";

/** Fades out body empty-state content before the post-auth reveal sequence. */
async function bodyAnimationFadeOut(content) {
  const body = document.querySelector(BODY_ROOT_SELECTOR);

  if (!body || !content) {
    return;
  }

  const fadeMs = animCssMsGet(body, BODY_VAR_AUTH_FADE_MS);
  const timeoutBufferMs = animCssMsGet(body, BODY_VAR_ANIMATION_TIMEOUT_BUFFER_MS);

  content.classList.add(BODY_CONTENT_FADE_PENDING_CLASS);
  await animFrameWait();
  await animTransitionEndWait(content, "opacity", fadeMs + timeoutBufferMs);
}

export { bodyAnimationFadeOut };
