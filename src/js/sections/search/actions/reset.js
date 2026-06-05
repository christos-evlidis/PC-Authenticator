import { searchFilterReset } from "./filter.js";
import { SEARCH_INPUT_SELECTOR } from "../constants.js";
import { SEARCH_ROOT_SELECTOR } from "../constants.js";
import { SEARCH_HIDDEN_CLASS } from "../constants.js";

/** Clears search input, filter state, and hides the search bar. */
export function searchReset() {
  const search = document.querySelector(SEARCH_ROOT_SELECTOR);
  const input = document.querySelector(SEARCH_INPUT_SELECTOR);

  if (input) {
    input.value = "";
  }

  search?.classList.add(SEARCH_HIDDEN_CLASS);
  searchFilterReset();
}
