import { SEARCH_ANIMATION_PENDING_CLASS, SEARCH_HIDDEN_CLASS, SEARCH_ROOT_SELECTOR } from "../../../../const/const.search.js";

/** Hides the search bar before an intro reveal sequence. */
function _searchAnimationPrepare() {
  const search = document.querySelector(SEARCH_ROOT_SELECTOR);

  if (!search) {
    return;
  }

  search.classList.remove(SEARCH_HIDDEN_CLASS);
  search.classList.add(SEARCH_ANIMATION_PENDING_CLASS);
}

export { _searchAnimationPrepare as searchAnimationPrepare };
