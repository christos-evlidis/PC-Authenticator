export { bodyAnimationPlay } from "./animations/play.js";

import { BODY_ACTIVE_CLASS } from "./constants.js";
import { BODY_HIDDEN_CLASS } from "./constants.js";
import { BODY_PENDING_CLASS } from "./constants.js";
import { BODY_ROOT_SELECTOR } from "./constants.js";
import { BODY_SIGNED_IN_VIEW_SELECTOR } from "./constants.js";
import { BODY_SIGNED_OUT_VIEW_SELECTOR } from "./constants.js";

/** Toggles signed-in/out body views and clears pending state when signed in. */
export function bodyApply(isSignedIn) {
  const root = document.querySelector(BODY_ROOT_SELECTOR);
  const signedOutView = document.querySelector(BODY_SIGNED_OUT_VIEW_SELECTOR);
  const signedInView = document.querySelector(BODY_SIGNED_IN_VIEW_SELECTOR);

  signedOutView?.classList.toggle(BODY_HIDDEN_CLASS, isSignedIn);
  signedInView?.classList.toggle(BODY_HIDDEN_CLASS, !isSignedIn);

  if (isSignedIn) {
    root?.classList.remove(BODY_PENDING_CLASS, BODY_ACTIVE_CLASS);
  }
}
