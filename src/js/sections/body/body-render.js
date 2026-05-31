import { BODY_CONTENT_SELECTOR } from "./body-constants.js";
import { BODY_ICON_SELECTOR } from "./body-constants.js";
import { BODY_MESSAGE_DISPLAY_SELECTOR } from "./body-constants.js";
import { BODY_MESSAGE_SPACER_SELECTOR } from "./body-constants.js";
import { BODY_MESSAGE_STACK_SELECTOR } from "./body-constants.js";
import { BODY_ROOT_SELECTOR } from "./body-constants.js";
import { BODY_SIGNED_IN_VIEW_SELECTOR } from "./body-constants.js";
import { BODY_SIGNED_OUT_VIEW_SELECTOR } from "./body-constants.js";

/** Returns icon and message elements for the signed-out body intro. */
export function bodyIntroElementsGet() {
  const content = document.querySelector(BODY_CONTENT_SELECTOR);

  if (!content) {
    return null;
  }

  const icon = content.querySelector(BODY_ICON_SELECTOR);
  const stack = content.querySelector(BODY_MESSAGE_STACK_SELECTOR);

  if (!stack) {
    return null;
  }

  const spacer = stack.querySelector(BODY_MESSAGE_SPACER_SELECTOR);
  const display = stack.querySelector(BODY_MESSAGE_DISPLAY_SELECTOR);

  if (!spacer || !display) {
    return null;
  }

  return { icon, stack, spacer, display };
}

/** Updates body signed-in vs signed-out view visibility and intro classes in the DOM. */
export function bodyViewsApply(isSignedIn) {
  const root = document.querySelector(BODY_ROOT_SELECTOR);
  const signedOutView = document.querySelector(BODY_SIGNED_OUT_VIEW_SELECTOR);
  const signedInView = document.querySelector(BODY_SIGNED_IN_VIEW_SELECTOR);

  if (signedOutView) {
    signedOutView.classList.toggle("hidden", isSignedIn);
  }

  if (signedInView) {
    signedInView.classList.toggle("hidden", !isSignedIn);
  }

  if (isSignedIn) {
    root?.classList.remove("is-intro-pending", "is-intro-complete");
  }
}
