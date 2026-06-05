import { SEARCH_ANIMATION_PENDING_CLASS } from "../constants.js";
import { SEARCH_FADE_IN_CLASS } from "../constants.js";
import { SEARCH_ROOT_SELECTOR } from "../constants.js";

/** Clears one-shot search animation classes after the intro sequence. */
function searchAnimationFinish() {
  const search = document.querySelector(SEARCH_ROOT_SELECTOR);

  if (!search) {
    return;
  }

  search.classList.remove(SEARCH_ANIMATION_PENDING_CLASS, SEARCH_FADE_IN_CLASS);
}

export { searchAnimationFinish };
