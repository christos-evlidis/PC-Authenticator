import { cssMs } from "../../../utils/utility-animation.js";
import { delay } from "../../../utils/utility-animation.js";
import { waitForNextFrame } from "../../../utils/utility-animation.js";
import { waitForTransitionEnd } from "../../../utils/utility-animation.js";
import { BODY_ANIMATION_TIMEOUT_BUFFER_MS } from "../body-constants.js";
import { BODY_ROOT_SELECTOR } from "../body-constants.js";
import { BODY_SPLASH_FADING_CLASS } from "../body-constants.js";
import { BODY_SPLASH_HIDDEN_CLASS } from "../body-constants.js";
import { BODY_SPLASH_SELECTOR } from "../body-constants.js";
import { BODY_VAR_INTRO_SPLASH_HOLD_MS } from "../body-constants.js";
import { BODY_VAR_SPLASH_FADE_MS } from "../body-constants.js";

/** Fades out the splash logo during frame intro. */
export async function bodyAnimateForLogo() {
  const body = document.querySelector(BODY_ROOT_SELECTOR);
  const splash = document.querySelector(BODY_SPLASH_SELECTOR);
  const splashHoldMs = cssMs(body, BODY_VAR_INTRO_SPLASH_HOLD_MS);
  const splashFadeMs = cssMs(body, BODY_VAR_SPLASH_FADE_MS);

  await waitForNextFrame();
  await delay(splashHoldMs);

  if (!splash) {
    return;
  }

  splash.classList.add(BODY_SPLASH_FADING_CLASS);
  await waitForNextFrame();
  await waitForTransitionEnd(
    splash,
    "opacity",
    splashFadeMs + BODY_ANIMATION_TIMEOUT_BUFFER_MS,
  );
  splash.classList.add(BODY_SPLASH_HIDDEN_CLASS);
  splash.classList.remove(BODY_SPLASH_FADING_CLASS);
}
