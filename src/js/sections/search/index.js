import { animCssMsGet } from "../../utils/utility-animation.js";
import { animDelay } from "../../utils/utility-animation.js";
import { searchFilterApply } from "./actions/filter.js";
import { searchReset } from "./actions/reset.js";
import { searchAnimationFadeIn } from "./animations/fade-in.js";
import { searchAnimationFinish } from "./animations/finish.js";

import { SEARCH_ANIMATION_PENDING_CLASS } from "./constants.js";
import { SEARCH_HIDDEN_CLASS } from "./constants.js";
import { SEARCH_INPUT_SELECTOR } from "./constants.js";
import { SEARCH_ROOT_SELECTOR } from "./constants.js";
import { SEARCH_VAR_ANIMATION_TIMEOUT_BUFFER_MS } from "./constants.js";

/** Wires search input filtering. */
function searchInit() {
  document.querySelector(SEARCH_INPUT_SELECTOR)?.addEventListener("input", () => {
    searchFilterApply();
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
    searchReset();
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

export { searchAnimationFinish } from "./animations/finish.js";
export { searchFilterApply } from "./actions/filter.js";
export { searchReset } from "./actions/reset.js";
export { searchInit };
export { searchApply };
export { searchAnimationPrepare };
export { searchAnimationRun };
