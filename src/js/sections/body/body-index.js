export { bodyAnimationPlay } from "./body-animations/body-animation-play.js";

import { BODY_ACTIVE_CLASS } from "./body-constants.js";
import { BODY_HIDDEN_CLASS } from "./body-constants.js";
import { BODY_PENDING_CLASS } from "./body-constants.js";
import { BODY_ROOT_SELECTOR } from "./body-constants.js";
import { BODY_SIGNED_IN_VIEW_SELECTOR } from "./body-constants.js";
import { BODY_SIGNED_OUT_VIEW_SELECTOR } from "./body-constants.js";

/** Applies body auth state and updates signed-in vs signed-out view visibility. */
export function bodyApply(isSignedIn) {
  const root = document.querySelector(BODY_ROOT_SELECTOR);
  const signedOutView = document.querySelector(BODY_SIGNED_OUT_VIEW_SELECTOR);
  const signedInView = document.querySelector(BODY_SIGNED_IN_VIEW_SELECTOR);

  if (signedOutView) {
    signedOutView.classList.toggle(BODY_HIDDEN_CLASS, isSignedIn);
  }

  if (signedInView) {
    signedInView.classList.toggle(BODY_HIDDEN_CLASS, !isSignedIn);
  }

  if (isSignedIn) {
    root?.classList.remove(BODY_PENDING_CLASS, BODY_ACTIVE_CLASS);
  }
}
