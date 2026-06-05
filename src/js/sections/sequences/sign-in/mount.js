import { INTRO_FRAME_SELECTOR } from "../constants.js";
import { INTRO_ROOT_SELECTOR } from "../constants.js";
import { INTRO_ROUNDED_CLASS } from "../constants.js";
import { INTRO_SIGN_IN_STAGED_CLASS } from "../constants.js";
import { INTRO_STYLESHEET_HREF } from "../constants.js";

/** Inserts the sign-in intro overlay shell when the load intro has already finished. */
function signInAnimationMount() {
  if (document.querySelector(INTRO_ROOT_SELECTOR)) {
    return;
  }

  if (!document.querySelector(`link[href="${INTRO_STYLESHEET_HREF}"]`)) {
    const link = document.createElement("link");

    link.rel = "stylesheet";
    link.href = INTRO_STYLESHEET_HREF;
    document.head.appendChild(link);
  }

  const frame = document.querySelector(INTRO_FRAME_SELECTOR);

  if (!frame) {
    return;
  }

  const intro = document.createElement("section");

  intro.className = `app-intro ${INTRO_SIGN_IN_STAGED_CLASS}`;
  intro.setAttribute("aria-hidden", "true");
  intro.setAttribute("aria-label", "Loading PC Authenticator");

  const overlay = document.createElement("div");

  overlay.className = `app-intro__overlay ${INTRO_ROUNDED_CLASS}`;
  intro.appendChild(overlay);
  frame.appendChild(intro);
}

/** Removes the sign-in intro overlay shell. */
function signInAnimationUnmount() {
  document.querySelector(INTRO_ROOT_SELECTOR)?.remove();
}

export { signInAnimationMount };
export { signInAnimationUnmount };
