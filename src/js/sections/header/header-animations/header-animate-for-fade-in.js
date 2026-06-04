import { cssMs } from "../../../utils/utility-animation.js";
import { waitForAnimationEnd } from "../../../utils/utility-animation.js";
import { waitForNextFrame } from "../../../utils/utility-animation.js";
import { HEADER_ANIMATION_TIMEOUT_BUFFER_MS } from "../header-constants.js";
import { HEADER_INTRO_FADE_IN_CLASS } from "../header-constants.js";
import { HEADER_INTRO_HIDDEN_CLASS } from "../header-constants.js";
import { HEADER_ROOT_SELECTOR } from "../header-constants.js";
import { HEADER_VAR_INTRO_FADE_MS } from "../header-constants.js";

/** Fades header shell in during frame intro. */
export async function headerAnimateForFadeIn() {
  const header = document.querySelector(HEADER_ROOT_SELECTOR);
  const introFadeMs = cssMs(header, HEADER_VAR_INTRO_FADE_MS);

  await waitForNextFrame();

  if (header) {
    header.classList.remove(HEADER_INTRO_HIDDEN_CLASS);
    header.classList.add(HEADER_INTRO_FADE_IN_CLASS);

    await waitForAnimationEnd(
      header,
      "headerIntroFadeIn",
      introFadeMs + HEADER_ANIMATION_TIMEOUT_BUFFER_MS,
    );
  }
}
