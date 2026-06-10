import { HEADER_HIDDEN_CLASS } from "./header-const.js";
import { HEADER_SIGNED_IN_VIEW_SELECTOR } from "./header-const.js";
import { HEADER_SIGNED_OUT_VIEW_SELECTOR } from "./header-const.js";

function headerInit(isSignedIn) {
  const signedOutView = document.querySelector(HEADER_SIGNED_OUT_VIEW_SELECTOR);
  const signedInView = document.querySelector(HEADER_SIGNED_IN_VIEW_SELECTOR);

  signedOutView?.classList.toggle(HEADER_HIDDEN_CLASS, isSignedIn);
  signedInView?.classList.toggle(HEADER_HIDDEN_CLASS, !isSignedIn);
}

export { headerInit };

export { headerActionsIconsDisable } from "./action/icons/disable.js";
export { headerActionsIconsEnable } from "./action/icons/enable.js";
export { headerAnimationFinish } from "./animation/finish.js";
export { headerAnimationInstant } from "./animation/instant.js";
export { headerAnimationReset } from "./animation/reset.js";
export { headerAnimationStart } from "./animation/start.js";
