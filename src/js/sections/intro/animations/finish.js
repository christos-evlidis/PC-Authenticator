import { INTRO_ROOT_SELECTOR } from "../constants.js";
import { INTRO_STYLESHEET_HREF } from "../constants.js";

/** Removes intro markup, inline styles, and the intro stylesheet from the document. */
export function introAnimationFinish() {
  document.querySelector(INTRO_ROOT_SELECTOR)?.remove();

  document
    .querySelector(`link[href="${INTRO_STYLESHEET_HREF}"]`)
    ?.remove();
}

/** Removes only the sign-in intro overlay shell. */
export function introSignInAnimationFinish() {
  document.querySelector(INTRO_ROOT_SELECTOR)?.remove();
}
