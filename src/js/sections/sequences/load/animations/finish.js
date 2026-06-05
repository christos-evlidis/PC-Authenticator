import { INTRO_ROOT_SELECTOR } from "../../constants.js";
import { INTRO_STYLESHEET_HREF } from "../../constants.js";

/** Removes intro markup, inline styles, and the intro stylesheet from the document. */
function introAnimationFinish() {
  document.querySelector(INTRO_ROOT_SELECTOR)?.remove();

  document
    .querySelector(`link[href="${INTRO_STYLESHEET_HREF}"]`)
    ?.remove();
}

export { introAnimationFinish };
