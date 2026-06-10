import { HEADER_HIDDEN_CLASS } from "./constants.js";
import { HEADER_SIGNED_IN_VIEW_SELECTOR } from "./constants.js";
import { HEADER_SIGNED_OUT_VIEW_SELECTOR } from "./constants.js";

function headerInit(isSignedIn) {
  const signedOutView = document.querySelector(HEADER_SIGNED_OUT_VIEW_SELECTOR);
  const signedInView = document.querySelector(HEADER_SIGNED_IN_VIEW_SELECTOR);

  signedOutView?.classList.toggle(HEADER_HIDDEN_CLASS, isSignedIn);
  signedInView?.classList.toggle(HEADER_HIDDEN_CLASS, !isSignedIn);
}

export { headerInit };
