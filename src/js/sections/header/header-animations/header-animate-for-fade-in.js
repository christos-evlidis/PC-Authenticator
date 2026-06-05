import { cssMs } from "../../../utils/utility-animation.js";
import { waitForAnimationEnd } from "../../../utils/utility-animation.js";
import { waitForNextFrame } from "../../../utils/utility-animation.js";
import { HEADER_ANIMATION_TIMEOUT_BUFFER_MS } from "../header-constants.js";
import { HEADER_ANIMATE_FOR_FADE_IN_CLASS } from "../header-constants.js";
import { HEADER_ANIMATE_FOR_FADE_IN_HIDDEN_CLASS } from "../header-constants.js";
import { HEADER_ROOT_SELECTOR } from "../header-constants.js";
import { HEADER_VAR_ANIMATE_FOR_FADE_IN_MS } from "../header-constants.js";

/** Fades header shell in during the fade-in phase. */
export async function headerAnimateForFadeIn() {
  const header = document.querySelector(HEADER_ROOT_SELECTOR);
  const fadeInMs = cssMs(header, HEADER_VAR_ANIMATE_FOR_FADE_IN_MS);

  await waitForNextFrame();

  if (header) {
    header.classList.remove(HEADER_ANIMATE_FOR_FADE_IN_HIDDEN_CLASS);
    header.classList.add(HEADER_ANIMATE_FOR_FADE_IN_CLASS);

    await waitForAnimationEnd(
      header,
      "headerAnimateForFadeIn",
      fadeInMs + HEADER_ANIMATION_TIMEOUT_BUFFER_MS,
    );
  }
}
