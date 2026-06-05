export { bodyRevealMessage } from "./reveal.js";

import { BODY_ACTIVE_CLASS } from "./constants.js";
import { BODY_HIDDEN_CLASS } from "./constants.js";
import { BODY_ROOT_SELECTOR } from "./constants.js";
import { BODY_SIGNED_IN_VIEW_SELECTOR } from "./constants.js";
import { BODY_SIGNED_OUT_VIEW_SELECTOR } from "./constants.js";

/** Toggles signed-in/out body views for the current auth state. */
export function bodyApply(isSignedIn) {
  const signedOutView = document.querySelector(BODY_SIGNED_OUT_VIEW_SELECTOR);
  const signedInView = document.querySelector(BODY_SIGNED_IN_VIEW_SELECTOR);

  signedOutView?.classList.toggle(BODY_HIDDEN_CLASS, isSignedIn);
  signedInView?.classList.toggle(BODY_HIDDEN_CLASS, !isSignedIn);

  if (isSignedIn) {
    document.querySelector(BODY_ROOT_SELECTOR)?.classList.remove(BODY_ACTIVE_CLASS);
  }
}
