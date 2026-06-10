import { BODY_ACTIVE_CLASS } from "./body-const.js";
import { BODY_CONTENT_FADE_PENDING_CLASS } from "./body-const.js";
import { BODY_CONTENT_HIDDEN_CLASS } from "./body-const.js";
import { BODY_CONTENT_SIGNED_IN_SELECTOR } from "./body-const.js";
import { BODY_CONTENT_SIGNED_OUT_SELECTOR } from "./body-const.js";
import { BODY_HIDDEN_CLASS } from "./body-const.js";
import { BODY_ROOT_SELECTOR } from "./body-const.js";
import { BODY_SIGNED_IN_VIEW_SELECTOR } from "./body-const.js";
import { BODY_SIGNED_OUT_VIEW_SELECTOR } from "./body-const.js";
import { CODES_HIDDEN_CLASS } from "../codes/codes-const.js";
import { CODES_ROOT_SELECTOR } from "../codes/codes-const.js";

/** Toggles signed-in empty state vs codes list visibility. */
function bodySignedInAccountsApply(hasAccounts) {
  const showCodes = Boolean(hasAccounts);

  document
    .querySelector(BODY_CONTENT_SIGNED_IN_SELECTOR)
    ?.classList.toggle(BODY_CONTENT_HIDDEN_CLASS, showCodes);
  document.querySelector(CODES_ROOT_SELECTOR)?.classList.toggle(CODES_HIDDEN_CLASS, !showCodes);
}

function bodyInit(isSignedIn, options = {}) {
  const signedOutView = document.querySelector(BODY_SIGNED_OUT_VIEW_SELECTOR);
  const signedInView = document.querySelector(BODY_SIGNED_IN_VIEW_SELECTOR);

  signedOutView?.classList.toggle(BODY_HIDDEN_CLASS, isSignedIn);
  signedInView?.classList.toggle(BODY_HIDDEN_CLASS, !isSignedIn);

  if (isSignedIn) {
    bodySignedInAccountsApply(options.hasAccounts === true);
  }

  if (isSignedIn) {
    document
      .querySelector(BODY_CONTENT_SIGNED_OUT_SELECTOR)
      ?.classList.remove(BODY_CONTENT_FADE_PENDING_CLASS);
  }

  if (isSignedIn) {
    document.querySelector(BODY_ROOT_SELECTOR)?.classList.remove(BODY_ACTIVE_CLASS);
  }
}

export { bodyInit };
export { bodySignedInAccountsApply };

export { bodyAnimationFinish } from "./animation/finish.js";
export { bodyAnimationInstant } from "./animation/instant.js";
export { bodyAnimationReset } from "./animation/reset.js";
export { bodyAnimationStart } from "./animation/start.js";
