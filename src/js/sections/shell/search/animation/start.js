import { animCssMsGet } from "../../../../utils/utility-animation.js";
import { animDelay } from "../../../../utils/utility-animation.js";

import { SEARCH_FADE_IN_CLASS, SEARCH_ROOT_SELECTOR, SEARCH_VAR_ANIMATION_TIMEOUT_BUFFER_MS, SEARCH_VAR_INTRO_FADE_MS } from "../../../../const/const.search.js";

async function _searchAnimationStart() {
  const search = document.querySelector(SEARCH_ROOT_SELECTOR);

  if (!search) {
    return;
  }

  const fadeMs = animCssMsGet(search, SEARCH_VAR_INTRO_FADE_MS);
  const timeoutBufferMs = animCssMsGet(search, SEARCH_VAR_ANIMATION_TIMEOUT_BUFFER_MS);

  search.classList.add(SEARCH_FADE_IN_CLASS);
  await animDelay(fadeMs + timeoutBufferMs);
}

export { _searchAnimationStart as searchAnimationStart };
