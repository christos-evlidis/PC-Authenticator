export { headerIconsDisable } from "./actions/icons.js";
export { headerIconsEnable } from "./actions/icons.js";

import { HEADER_HIDDEN_CLASS } from "./constants.js";
import { HEADER_SIGNED_IN_VIEW_SELECTOR } from "./constants.js";
import { HEADER_SIGNED_OUT_VIEW_SELECTOR } from "./constants.js";

/** Toggles signed-in/out header views for the current auth state. */
export function headerApply(isSignedIn) {
  const signedOutView = document.querySelector(HEADER_SIGNED_OUT_VIEW_SELECTOR);
  const signedInView = document.querySelector(HEADER_SIGNED_IN_VIEW_SELECTOR);

  signedOutView?.classList.toggle(HEADER_HIDDEN_CLASS, isSignedIn);
  signedInView?.classList.toggle(HEADER_HIDDEN_CLASS, !isSignedIn);
}
