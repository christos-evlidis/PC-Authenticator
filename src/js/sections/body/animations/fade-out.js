import { cssMs } from "../../../utils/utility-animation.js";
import { delay } from "../../../utils/utility-animation.js";
import { waitForNextFrame } from "../../../utils/utility-animation.js";
import { BODY_CONTENT_FADE_PENDING_CLASS } from "../constants.js";
import { BODY_ROOT_SELECTOR } from "../constants.js";
import { BODY_VAR_INTRO_FADE_MS } from "../constants.js";

/** Fades out body empty-state content before the sign-in intro continues. */
export async function bodyAnimationFadeOutContent(content) {
  const body = document.querySelector(BODY_ROOT_SELECTOR);

  if (!body || !content) {
    return;
  }

  content.classList.add(BODY_CONTENT_FADE_PENDING_CLASS);
  await waitForNextFrame();
  await delay(cssMs(body, BODY_VAR_INTRO_FADE_MS));
}
