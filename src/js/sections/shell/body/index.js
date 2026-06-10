import { BODY_ACTIVE_CLASS } from "./constants.js";
import { BODY_CONTENT_FADE_PENDING_CLASS } from "./constants.js";
import { BODY_CONTENT_HIDDEN_CLASS } from "./constants.js";
import { BODY_CONTENT_SIGNED_IN_SELECTOR } from "./constants.js";
import { BODY_CONTENT_SIGNED_OUT_SELECTOR } from "./constants.js";
import { BODY_HIDDEN_CLASS } from "./constants.js";
import { BODY_ROOT_SELECTOR } from "./constants.js";
import { BODY_SIGNED_IN_VIEW_SELECTOR } from "./constants.js";
import { BODY_SIGNED_OUT_VIEW_SELECTOR } from "./constants.js";

function bodyInit(isSignedIn, options = {}) {
  const signedOutView = document.querySelector(BODY_SIGNED_OUT_VIEW_SELECTOR);
  const signedInView = document.querySelector(BODY_SIGNED_IN_VIEW_SELECTOR);
  const signedInContent = document.querySelector(BODY_CONTENT_SIGNED_IN_SELECTOR);
  const hideEmptyState = isSignedIn && options.hasAccounts === true;

  signedOutView?.classList.toggle(BODY_HIDDEN_CLASS, isSignedIn);
  signedInView?.classList.toggle(BODY_HIDDEN_CLASS, !isSignedIn);
  signedInContent?.classList.toggle(BODY_CONTENT_HIDDEN_CLASS, hideEmptyState);

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
