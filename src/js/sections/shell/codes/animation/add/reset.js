import { CODES_HIDDEN_CLASS } from "../../codes-const.js";

/** Toggles list visibility when adding the first card. */
function codesAnimationAddReset(empty, list, isEmpty) {
  empty?.classList.add(CODES_HIDDEN_CLASS);
  list?.classList.toggle(CODES_HIDDEN_CLASS, isEmpty);
}

export { codesAnimationAddReset };
