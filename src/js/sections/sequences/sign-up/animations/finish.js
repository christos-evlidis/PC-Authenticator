import { INTRO_ROOT_SELECTOR } from "../../constants.js";

/** Removes only the sign-up intro overlay shell. */
function signUpAnimationFinish() {
  document.querySelector(INTRO_ROOT_SELECTOR)?.remove();
}

export { signUpAnimationFinish };
