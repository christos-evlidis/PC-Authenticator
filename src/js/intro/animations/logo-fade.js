import { cssMs } from "../../utils/utility-animation.js";
import { delay } from "../../utils/utility-animation.js";
import { INTRO_ROOT_SELECTOR } from "../constants.js";
import { INTRO_VAR_LOGO_HOLD_MS } from "../constants.js";

/** Holds the logo on screen before the frame shrink begins. */
export async function introAnimationLogo() {
  const intro = document.querySelector(INTRO_ROOT_SELECTOR);

  if (!intro) {
    return;
  }

  await delay(cssMs(intro, INTRO_VAR_LOGO_HOLD_MS));
}
