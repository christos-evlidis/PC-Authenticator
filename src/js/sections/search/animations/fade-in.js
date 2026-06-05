import { animCssMsGet } from "../../../utils/utility-animation.js";
import { animDelay } from "../../../utils/utility-animation.js";

import { SEARCH_FADE_IN_CLASS } from "../constants.js";
import { SEARCH_ROOT_SELECTOR } from "../constants.js";
import { SEARCH_VAR_ANIMATION_TIMEOUT_BUFFER_MS } from "../constants.js";
import { SEARCH_VAR_INTRO_FADE_MS } from "../constants.js";

/** Fades in the search bar after the intro overlay shrinks past it. */
async function searchAnimationFadeIn() {
  const search = document.querySelector(SEARCH_ROOT_SELECTOR);

  if (!search) {
    return;
  }

  const fadeMs = animCssMsGet(search, SEARCH_VAR_INTRO_FADE_MS);
  const timeoutBufferMs = animCssMsGet(search, SEARCH_VAR_ANIMATION_TIMEOUT_BUFFER_MS);

  search.classList.add(SEARCH_FADE_IN_CLASS);
  await animDelay(fadeMs + timeoutBufferMs);
}

export { searchAnimationFadeIn };
