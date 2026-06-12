import { HEADER_HIDDEN_CLASS } from "./header-const.js";
import { HEADER_SIGNED_IN_VIEW_SELECTOR } from "./header-const.js";
import { HEADER_SIGNED_OUT_VIEW_SELECTOR } from "./header-const.js";
import { headerAnimationInstant } from "./animation/instant.js";

function headerInit(isSignedIn) {
  const signedOutView = document.querySelector(HEADER_SIGNED_OUT_VIEW_SELECTOR);
  const signedInView = document.querySelector(HEADER_SIGNED_IN_VIEW_SELECTOR);

  signedOutView?.classList.toggle(HEADER_HIDDEN_CLASS, isSignedIn);
  signedInView?.classList.toggle(HEADER_HIDDEN_CLASS, !isSignedIn);
}

export { headerInit };

function headerApplySignedIn(options = {}) {
  headerInit(true);

  if (options.instant) {
    headerAnimationInstant();
  }
}

function headerApplySignedOut(options = {}) {
  headerInit(false);

  if (options.instant) {
    headerAnimationInstant();
  }
}

export { headerApplySignedIn, headerApplySignedOut };

export { headerActionIconsDisable } from "./action/icons/disable.js";
export { headerActionIconsEnable } from "./action/icons/enable.js";
export { headerAnimationFinish } from "./animation/finish.js";
export { headerAnimationInstant } from "./animation/instant.js";
export { headerAnimationReset } from "./animation/reset.js";
export { headerAnimationStart } from "./animation/start.js";
