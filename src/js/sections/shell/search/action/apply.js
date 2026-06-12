import { searchActionReset } from "./reset.js";

import { INTRO_ROOT_SELECTOR } from "../../../../services/sequences/sequences-const.js";
import { SEARCH_HIDDEN_CLASS } from "../search-const.js";
import { SEARCH_ROOT_SELECTOR } from "../search-const.js";

/** Shows or hides the search bar based on auth state. */
function searchApply(isAuthVisible) {
  const search = document.querySelector(SEARCH_ROOT_SELECTOR);
  const intro = document.querySelector(INTRO_ROOT_SELECTOR);

  if (!search) {
    return;
  }

  if (!isAuthVisible) {
    searchActionReset();
    return;
  }

  if (!intro) {
    search.classList.remove(SEARCH_HIDDEN_CLASS);
  }
}

export { searchApply };
