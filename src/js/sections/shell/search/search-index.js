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
export { searchAnimationFinish } from "./animation/finish.js";
export { searchAnimationInstant } from "./animation/instant.js";
export { searchAnimationPrepare } from "./animation/prepare.js";
export { searchAnimationRun } from "./animation/run.js";
export { searchAnimationStart } from "./animation/start.js";

// Functions exported from this section:
// - searchInit
// - searchApply
// - searchActionFilter
// - searchActionReset
// - searchAnimationFinish
// - searchAnimationInstant
// - searchAnimationPrepare
// - searchAnimationRun
// - searchAnimationStart

// Functions used by other parts of the codebase:
// - searchInit (used in project/src/js/sections/sections-index.js)
// - searchApply (used in project/src/js/app/app.shell.js)
// - searchAnimationPrepare (used in project/src/js/services/sequences/animation/load/start.js)
// - searchAnimationRun (used in project/src/js/services/sequences/animation/load/start.js)
// - searchAnimationInstant (used in project/src/js/services/sequences/animation/load/instant.js)
