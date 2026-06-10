import { HEADER_HIDDEN_CLASS } from "./constants.js";
import { HEADER_SIGNED_IN_VIEW_SELECTOR } from "./constants.js";
import { HEADER_SIGNED_OUT_VIEW_SELECTOR } from "./constants.js";

/** Toggles signed-in/out header views for the current auth state. */
function headerInit(isSignedIn) {
  const signedOutView = document.querySelector(HEADER_SIGNED_OUT_VIEW_SELECTOR);
  const signedInView = document.querySelector(HEADER_SIGNED_IN_VIEW_SELECTOR);

  signedOutView?.classList.toggle(HEADER_HIDDEN_CLASS, isSignedIn);
  signedInView?.classList.toggle(HEADER_HIDDEN_CLASS, !isSignedIn);
}

export { headerActionsIconsDisable } from "./actions/icons/disable.js";
export { headerActionsIconsEnable } from "./actions/icons/enable.js";
export { headerAnimationFinish } from "./animation/finish.js";
export { headerAnimationInstant } from "./animation/instant.js";
export { headerAnimationReset } from "./animation/reset.js";
export { headerAnimationStart } from "./animation/start.js";
export { headerInit };
