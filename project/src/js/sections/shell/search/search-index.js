import { searchActionFilter } from "./action/filter.js";
import { SEARCH_INPUT_SELECTOR } from "../../../const/const.search.js";

function _searchInit() {
  document.querySelector(SEARCH_INPUT_SELECTOR)?.addEventListener("input", () => {
    searchActionFilter();
  });
}

export { _searchInit as searchInit };
export { searchApply } from "./action/apply.js";
export { searchActionFilter } from "./action/filter.js";
export { searchActionReset } from "./action/reset.js";
