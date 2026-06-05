import { cssMs } from "../../../utils/utility-animation.js";
import { delay } from "../../../utils/utility-animation.js";
import { HEADER_FADE_IN_CLASS } from "../constants.js";
import { HEADER_ROOT_SELECTOR } from "../constants.js";
import { HEADER_VAR_ANIMATION_TIMEOUT_BUFFER_MS } from "../constants.js";
import { HEADER_VAR_INTRO_FADE_MS } from "../constants.js";

/** Fades in the full header after the intro overlay finishes shrinking. */
export async function headerAnimationFadeIn() {
  const header = document.querySelector(HEADER_ROOT_SELECTOR);

  if (!header) {
    return;
  }

  const fadeMs = cssMs(header, HEADER_VAR_INTRO_FADE_MS);
  const timeoutBufferMs = cssMs(header, HEADER_VAR_ANIMATION_TIMEOUT_BUFFER_MS);

  header.classList.add(HEADER_FADE_IN_CLASS);
  await delay(fadeMs + timeoutBufferMs);
}
