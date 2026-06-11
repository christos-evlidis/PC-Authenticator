import { SEARCH_ANIMATION_PENDING_CLASS } from "../search-const.js";
import { SEARCH_HIDDEN_CLASS } from "../search-const.js";
import { SEARCH_ROOT_SELECTOR } from "../search-const.js";

/** Hides the search bar before an intro reveal sequence. */
function searchAnimationPrepare() {
  const search = document.querySelector(SEARCH_ROOT_SELECTOR);

  if (!search) {
    return;
  }

  search.classList.remove(SEARCH_HIDDEN_CLASS);
  search.classList.add(SEARCH_ANIMATION_PENDING_CLASS);
}

export { searchAnimationPrepare };
