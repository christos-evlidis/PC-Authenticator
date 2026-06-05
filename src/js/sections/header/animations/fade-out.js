import { animCssMsGet } from "../../../utils/utility-animation.js";
import { animDelay } from "../../../utils/utility-animation.js";
import { animFrameWait } from "../../../utils/utility-animation.js";

import { HEADER_CONTENT_PENDING_CLASS } from "../constants.js";
import { HEADER_ROOT_SELECTOR } from "../constants.js";
import { HEADER_VAR_INTRO_FADE_MS } from "../constants.js";

/** Fades out header contents while keeping the shell visible. */
async function headerAnimationFadeOutContents() {
  const header = document.querySelector(HEADER_ROOT_SELECTOR);

  if (!header) {
    return;
  }

  header.classList.add(HEADER_CONTENT_PENDING_CLASS);
  await animFrameWait();
  await animDelay(animCssMsGet(header, HEADER_VAR_INTRO_FADE_MS));
}

export { headerAnimationFadeOutContents };
