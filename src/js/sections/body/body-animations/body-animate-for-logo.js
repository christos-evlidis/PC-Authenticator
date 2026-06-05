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

/** Holds the splash logo visible before fade-out begins. */
export async function bodyAnimateForLogoHold() {
  await waitForNextFrame();
}

/** Fades out the splash logo during frame intro. */
export async function bodyAnimateForLogoFade() {
  const body = document.querySelector(BODY_ROOT_SELECTOR);
  const splash = document.querySelector(BODY_SPLASH_SELECTOR);
  const splashHoldMs = cssMs(body, BODY_VAR_INTRO_SPLASH_HOLD_MS);
  const splashFadeMs = cssMs(body, BODY_VAR_SPLASH_FADE_MS);

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

/** Holds the splash logo, then fades it out. */
export async function bodyAnimateForLogo() {
  await bodyAnimateForLogoHold();
  await bodyAnimateForLogoFade();
}
