import { searchActionFilter } from "./filter.js";

import { SEARCH_ANIMATION_PENDING_CLASS, SEARCH_FADE_IN_CLASS, SEARCH_HIDDEN_CLASS, SEARCH_INPUT_SELECTOR, SEARCH_ROOT_SELECTOR } from "../../../../const/const.search.js";

/** Clears search input, hides the bar, and removes card filters. */
function searchActionReset() {
  const search = document.querySelector(SEARCH_ROOT_SELECTOR);
  const input = document.querySelector(SEARCH_INPUT_SELECTOR);

  if (input) {
    input.value = "";
  }

  search?.classList.remove(SEARCH_ANIMATION_PENDING_CLASS, SEARCH_FADE_IN_CLASS);
  search?.classList.add(SEARCH_HIDDEN_CLASS);
  searchActionFilter();
}

export { searchActionReset };
