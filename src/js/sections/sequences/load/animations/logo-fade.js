import { animCssMsGet } from "../../../../utils/utility-animation.js";
import { animDelay } from "../../../../utils/utility-animation.js";

import { INTRO_ROOT_SELECTOR } from "../../constants.js";
import { INTRO_VAR_LOGO_HOLD_MS } from "../../constants.js";

/** Holds the logo on screen before the frame shrink begins. */
async function loadAnimationLogo() {
  const intro = document.querySelector(INTRO_ROOT_SELECTOR);

  if (!intro) {
    return;
  }

  await animDelay(animCssMsGet(intro, INTRO_VAR_LOGO_HOLD_MS));
}

export { loadAnimationLogo };
