import { animCssMsGet } from "../../utils/utility-animation.js";
import { animDelay } from "../../utils/utility-animation.js";
import { bodyAnimationIconPop } from "./animations/icon-pop.js";
import { bodyAnimationFinish } from "./animations/finish.js";
import { bodyAnimationMessageType } from "./animations/message-type.js";

import { BODY_ANIMATION_PENDING_CLASS } from "./constants.js";
import { BODY_CONTENT_FADE_PENDING_CLASS } from "./constants.js";
import { BODY_CONTENT_HIDDEN_CLASS } from "./constants.js";
import { BODY_CONTENT_SIGNED_IN_SELECTOR } from "./constants.js";
import { BODY_CONTENT_SIGNED_OUT_SELECTOR } from "./constants.js";
import { BODY_HIDDEN_CLASS } from "./constants.js";
import { BODY_ICON_POP_PENDING_CLASS } from "./constants.js";
import { BODY_ICON_POP_REVEALED_CLASS } from "./constants.js";
import { BODY_ICON_SELECTOR } from "./constants.js";
import { BODY_MESSAGE_DISPLAY_SELECTOR } from "./constants.js";
import { BODY_MESSAGE_SPACER_SELECTOR } from "./constants.js";
import { BODY_MESSAGE_STACK_SELECTOR } from "./constants.js";
import { BODY_ROOT_SELECTOR } from "./constants.js";
import { BODY_SIGNED_IN_EMPTY_MESSAGE_TEXT } from "./constants.js";
import { BODY_SIGNED_IN_VIEW_SELECTOR } from "./constants.js";
import { BODY_SIGNED_OUT_MESSAGE_TEXT } from "./constants.js";
import { BODY_VAR_ANIMATION_TIMEOUT_BUFFER_MS } from "./constants.js";
import { BODY_ACTIVE_CLASS } from "./constants.js";
import { BODY_SIGNED_OUT_VIEW_SELECTOR } from "./constants.js";

/** Toggles signed-in/out body views for the current auth state. */
function bodyApply(isSignedIn, options = {}) {
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

/** Hides the body empty-state content before an intro reveal sequence. */
async function bodyAnimationPrepare(mode) {
  const body = document.querySelector(BODY_ROOT_SELECTOR);
  const signedOutView = document.querySelector(BODY_SIGNED_OUT_VIEW_SELECTOR);
  const signedInView = document.querySelector(BODY_SIGNED_IN_VIEW_SELECTOR);
  let content = null;
  let signedIn = false;

  if (!signedOutView?.classList.contains(BODY_HIDDEN_CLASS)) {
    content = document.querySelector(BODY_CONTENT_SIGNED_OUT_SELECTOR);
  } else if (!signedInView?.classList.contains(BODY_HIDDEN_CLASS)) {
    content = document.querySelector(BODY_CONTENT_SIGNED_IN_SELECTOR);
    signedIn = true;
  }

  body?.classList.remove(BODY_HIDDEN_CLASS);

  if (!body || !content) {
    return;
  }

  if (signedIn && content.classList.contains(BODY_CONTENT_HIDDEN_CLASS)) {
    return;
  }

  const stack = content.querySelector(BODY_MESSAGE_STACK_SELECTOR);
  const spacer = content.querySelector(BODY_MESSAGE_SPACER_SELECTOR);
  const display = content.querySelector(BODY_MESSAGE_DISPLAY_SELECTOR);
  const icon = content.querySelector(BODY_ICON_SELECTOR);
  const stored = stack?.dataset?.fullText;
  const defaultText = signedIn
    ? BODY_SIGNED_IN_EMPTY_MESSAGE_TEXT
    : BODY_SIGNED_OUT_MESSAGE_TEXT;
  const fullText = stored ? stored.replace(/\\n/g, "\n") : defaultText;

  body.classList.add(BODY_ANIMATION_PENDING_CLASS);

  if (stack && spacer && display) {
    stack.dataset.fullText = fullText;
    spacer.textContent = fullText;
    display.textContent = "";
  }

  if (icon) {
    icon.classList.add(BODY_ICON_POP_PENDING_CLASS);
    icon.classList.remove(BODY_ICON_POP_REVEALED_CLASS);
    icon.classList.remove(BODY_ACTIVE_CLASS);
  }

  body.classList.remove(BODY_ACTIVE_CLASS);
}

/** Runs the body reveal sequence after an intro shrink phase. */
async function bodyAnimationRun(mode) {
  const body = document.querySelector(BODY_ROOT_SELECTOR);
  const signedOutView = document.querySelector(BODY_SIGNED_OUT_VIEW_SELECTOR);
  const signedInView = document.querySelector(BODY_SIGNED_IN_VIEW_SELECTOR);
  let content = null;

  if (!signedOutView?.classList.contains(BODY_HIDDEN_CLASS)) {
    content = document.querySelector(BODY_CONTENT_SIGNED_OUT_SELECTOR);
  } else if (!signedInView?.classList.contains(BODY_HIDDEN_CLASS)) {
    content = document.querySelector(BODY_CONTENT_SIGNED_IN_SELECTOR);
  }

  if (!body) {
    return;
  }

  if (!content || !body.classList.contains(BODY_ANIMATION_PENDING_CLASS)) {
    bodyAnimationFinish();
    return;
  }

  try {
    await animDelay(animCssMsGet(body, BODY_VAR_ANIMATION_TIMEOUT_BUFFER_MS));
    await bodyAnimationIconPop(content);
    await bodyAnimationMessageType(content);
    bodyAnimationFinish();
  } catch {
    bodyAnimationFinish();
  }
}

export { bodyAnimationFinish } from "./animations/finish.js";
export { bodyApply };
export { bodyAnimationPrepare };
export { bodyAnimationRun };


