import { SEARCH_ANIMATION_PENDING_CLASS, SEARCH_FADE_IN_CLASS, SEARCH_HIDDEN_CLASS, SEARCH_ROOT_SELECTOR } from "../../../../const/const.search.js";

function searchAnimationInstant() {
  const search = document.querySelector(SEARCH_ROOT_SELECTOR);

  if (!search) {
    return;
  }

  search.classList.remove(
    SEARCH_HIDDEN_CLASS,
    SEARCH_ANIMATION_PENDING_CLASS,
    SEARCH_FADE_IN_CLASS,
  );
}

export { searchAnimationInstant };
