export { searchFilterApply } from "./actions/filter.js";
export { searchReset } from "./actions/reset.js";

import { searchFilterApply } from "./actions/filter.js";
import { searchReset } from "./actions/reset.js";
import { SEARCH_HIDDEN_CLASS } from "./constants.js";
import { SEARCH_INPUT_SELECTOR } from "./constants.js";
import { SEARCH_ROOT_SELECTOR } from "./constants.js";

/** Wires search input filtering. */
export function searchInit() {
  document.querySelector(SEARCH_INPUT_SELECTOR)?.addEventListener("input", () => {
    searchFilterApply();
  });
}

/** Shows or hides the search bar based on auth state. */
export function searchApply(isAuthVisible) {
  const search = document.querySelector(SEARCH_ROOT_SELECTOR);

  if (!search) {
    return;
  }

  if (!isAuthVisible) {
    searchReset();
    return;
  }

  search.classList.remove(SEARCH_HIDDEN_CLASS);
}
