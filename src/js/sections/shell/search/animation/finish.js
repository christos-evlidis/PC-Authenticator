import { SEARCH_ANIMATION_PENDING_CLASS, SEARCH_FADE_IN_CLASS, SEARCH_ROOT_SELECTOR } from "../../../../const/const.search.js";

function searchAnimationFinish() {
  const search = document.querySelector(SEARCH_ROOT_SELECTOR);

  if (!search) {
    return;
  }

  search.classList.remove(SEARCH_ANIMATION_PENDING_CLASS, SEARCH_FADE_IN_CLASS);
}

export { searchAnimationFinish };
