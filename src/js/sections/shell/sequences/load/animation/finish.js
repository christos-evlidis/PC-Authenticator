import { INTRO_ROOT_SELECTOR } from "../../constants.js";
import { INTRO_STYLESHEET_HREF } from "../../constants.js";

const LOAD_OVERLAY_ROOT_SELECTORS = [
  ".app-user-menu",
  ".manual-setup",
  ".qr-setup"
];

/** Reveals overlay roots and removes load intro markup from the document. */
function loadAnimationFinish() {
  LOAD_OVERLAY_ROOT_SELECTORS.forEach((selector) => {
    document.querySelector(selector)?.classList.remove("is-hidden");
  });

  document.querySelector(INTRO_ROOT_SELECTOR)?.remove();

  document
    .querySelector(`link[href="${INTRO_STYLESHEET_HREF}"]`)
    ?.remove();
}

export { loadAnimationFinish };
