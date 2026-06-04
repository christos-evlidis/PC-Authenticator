export { headerAnimationPlay } from "./header-animations/header-animation-play.js";
export { headerIconsDisable } from "./header-actions/header-icons.js";
export { headerIconsEnable } from "./header-actions/header-icons.js";

import { HEADER_HIDDEN_CLASS } from "./header-constants.js";
import { HEADER_SIGNED_IN_VIEW_SELECTOR } from "./header-constants.js";
import { HEADER_SIGNED_OUT_VIEW_SELECTOR } from "./header-constants.js";

/** Applies header auth state and updates signed-in vs signed-out view visibility. */
export function headerApply(isSignedIn) {
  const signedOutView = document.querySelector(HEADER_SIGNED_OUT_VIEW_SELECTOR);
  const signedInView = document.querySelector(HEADER_SIGNED_IN_VIEW_SELECTOR);

  if (signedOutView) {
    signedOutView.classList.toggle(HEADER_HIDDEN_CLASS, isSignedIn);
  }

  if (signedInView) {
    signedInView.classList.toggle(HEADER_HIDDEN_CLASS, !isSignedIn);
  }
}
