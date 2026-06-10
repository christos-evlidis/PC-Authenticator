import { SEARCH_ANIMATION_PENDING_CLASS } from "../constants.js";
import { SEARCH_FADE_IN_CLASS } from "../constants.js";
import { SEARCH_HIDDEN_CLASS } from "../constants.js";
import { SEARCH_ROOT_SELECTOR } from "../constants.js";

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
