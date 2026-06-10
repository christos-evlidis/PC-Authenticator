import { animCssMsGet } from "../../../../../utils/utility-animation.js";
import { animDelay } from "../../../../../utils/utility-animation.js";

import { INTRO_ROOT_SELECTOR } from "../../sequences-const.js";
import { INTRO_VAR_LOGO_HOLD_MS } from "../../sequences-const.js";

async function loadAnimationLogo() {
  const intro = document.querySelector(INTRO_ROOT_SELECTOR);

  if (!intro) {
    return;
  }

  await animDelay(animCssMsGet(intro, INTRO_VAR_LOGO_HOLD_MS));
}

export { loadAnimationLogo };
