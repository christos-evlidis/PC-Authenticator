import { animCssMsGet } from "../../../utils/utility-animation.js";
import { animDelay } from "../../../utils/utility-animation.js";
import { searchAnimationFadeIn } from "./animation/fade-in.js";
import { searchAnimationFinish } from "./animation/finish.js";
import { searchActionFilter } from "./action/filter.js";
import { searchActionReset } from "./action/reset.js";

import { SEARCH_ANIMATION_PENDING_CLASS } from "./search-const.js";
import { SEARCH_HIDDEN_CLASS } from "./search-const.js";
import { SEARCH_INPUT_SELECTOR } from "./search-const.js";
import { SEARCH_ROOT_SELECTOR } from "./search-const.js";
import { SEARCH_VAR_ANIMATION_TIMEOUT_BUFFER_MS } from "./search-const.js";

function searchInit() {
  document.querySelector(SEARCH_INPUT_SELECTOR)?.addEventListener("input", () => {
    searchActionFilter();
  });
}

/** Shows or hides the search bar based on auth state. */
function searchApply(isAuthVisible) {
  const search = document.querySelector(SEARCH_ROOT_SELECTOR);
  const intro = document.querySelector(".app-intro");

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

/** Hides the search bar before an intro reveal sequence. */
function searchAnimationPrepare(mode) {
  const search = document.querySelector(SEARCH_ROOT_SELECTOR);

  if (!search) {
    return;
  }

  search.classList.remove(SEARCH_HIDDEN_CLASS);
  search.classList.add(SEARCH_ANIMATION_PENDING_CLASS);
}

/** Runs the search reveal sequence after an intro shrink phase. */
async function searchAnimationRun(mode) {
  const search = document.querySelector(SEARCH_ROOT_SELECTOR);

  if (!search) {
    return;
  }

  if (!search.classList.contains(SEARCH_ANIMATION_PENDING_CLASS)) {
    searchAnimationFinish();
    return;
  }

  try {
    await animDelay(animCssMsGet(search, SEARCH_VAR_ANIMATION_TIMEOUT_BUFFER_MS));
    await searchAnimationFadeIn();
    searchAnimationFinish();
  } catch {
    searchAnimationFinish();
  }
}

export { searchAnimationPrepare };
export { searchAnimationRun };
export { searchApply };
export { searchInit };

export { searchActionFilter } from "./action/filter.js";
export { searchActionReset } from "./action/reset.js";
export { searchAnimationFadeIn } from "./animation/fade-in.js";
export { searchAnimationFinish } from "./animation/finish.js";
export { searchAnimationInstant } from "./animation/instant.js";
