import { searchActionFilter } from "./action/filter.js";

import { SEARCH_INPUT_SELECTOR } from "../../../const/const.search.js";

function searchInit() {
  document.querySelector(SEARCH_INPUT_SELECTOR)?.addEventListener("input", () => {
    searchActionFilter();
  });
}

export { searchInit };

export { searchApply } from "./action/apply.js";
export { searchActionFilter } from "./action/filter.js";
export { searchActionReset } from "./action/reset.js";
export { searchAnimationFinish } from "./animation/finish.js";
export { searchAnimationInstant } from "./animation/instant.js";
export { searchAnimationPrepare } from "./animation/prepare.js";
export { searchAnimationRun } from "./animation/run.js";
export { searchAnimationStart } from "./animation/start.js";
