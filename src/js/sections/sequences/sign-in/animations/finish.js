import { INTRO_ROOT_SELECTOR } from "../../constants.js";

/** Removes only the sign-in intro overlay shell. */
function signInAnimationFinish() {
  document.querySelector(INTRO_ROOT_SELECTOR)?.remove();
}

export { signInAnimationFinish };
