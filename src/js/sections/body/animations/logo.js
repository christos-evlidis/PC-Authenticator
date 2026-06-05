import { cssMs } from "../../../utils/utility-animation.js";
import { delay } from "../../../utils/utility-animation.js";
import { waitForNextFrame } from "../../../utils/utility-animation.js";
import { waitForTransitionEnd } from "../../../utils/utility-animation.js";
import { BODY_ANIMATE_FOR_LOGO_CLASS } from "../constants.js";
import { BODY_ANIMATION_TIMEOUT_BUFFER_MS } from "../constants.js";
import { BODY_LOGO_FADING_CLASS } from "../constants.js";
import { BODY_LOGO_SELECTOR } from "../constants.js";
import { BODY_ROOT_SELECTOR } from "../constants.js";
import { BODY_VAR_ANIMATE_FOR_LOGO_HOLD_MS } from "../constants.js";
import { BODY_VAR_LOGO_FADE_MS } from "../constants.js";

/** Holds the logo, fades it out, and marks the logo element complete for the logo phase. */
export async function bodyAnimateForLogo() {
  const body = document.querySelector(BODY_ROOT_SELECTOR);
  const logo = document.querySelector(BODY_LOGO_SELECTOR);
  const logoHoldMs = cssMs(body, BODY_VAR_ANIMATE_FOR_LOGO_HOLD_MS);
  const logoFadeMs = cssMs(body, BODY_VAR_LOGO_FADE_MS);

  await waitForNextFrame();
  await delay(logoHoldMs);

  if (!logo) {
    return;
  }

  logo.classList.add(BODY_LOGO_FADING_CLASS);
  await waitForNextFrame();
  await waitForTransitionEnd(
    logo,
    "opacity",
    logoFadeMs + BODY_ANIMATION_TIMEOUT_BUFFER_MS,
  );
  logo.classList.add(BODY_ANIMATE_FOR_LOGO_CLASS);
  logo.classList.remove(BODY_LOGO_FADING_CLASS);
}
