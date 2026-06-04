import { HEADER_INTRO_FADE_IN_CLASS } from "../header-constants.js";
import { HEADER_INTRO_HIDDEN_CLASS } from "../header-constants.js";
import { HEADER_ROOT_SELECTOR } from "../header-constants.js";

/** Removes intro fade classes after header content animation completes. */
export function headerAnimateForFinish() {
  const header = document.querySelector(HEADER_ROOT_SELECTOR);

  header?.classList.remove(HEADER_INTRO_HIDDEN_CLASS, HEADER_INTRO_FADE_IN_CLASS);
}
