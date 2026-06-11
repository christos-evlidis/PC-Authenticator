import { animCssMsGet } from "../../../../utils/utility-animation.js";
import { animDelay } from "../../../../utils/utility-animation.js";

import { searchAnimationFinish } from "./finish.js";
import { searchAnimationStart } from "./start.js";

import { SEARCH_ANIMATION_PENDING_CLASS } from "../search-const.js";
import { SEARCH_ROOT_SELECTOR } from "../search-const.js";
import { SEARCH_VAR_ANIMATION_TIMEOUT_BUFFER_MS } from "../search-const.js";

/** Runs the search reveal sequence after an intro shrink phase. */
async function searchAnimationRun() {
  const search = document.querySelector(SEARCH_ROOT_SELECTOR);

  if (!search) {
    return;
  }

  if (!search.classList.contains(SEARCH_ANIMATION_PENDING_CLASS)) {
    searchAnimationFinish();
    return;
  }

  try {
    await animDelay(animCssMsGet(search, SEARCH_VAR_ANIMATION_TIMEOUT_BUFFER_MS));
    await searchAnimationStart();
    searchAnimationFinish();
  } catch {
    searchAnimationFinish();
  }
}

export { searchAnimationRun };
