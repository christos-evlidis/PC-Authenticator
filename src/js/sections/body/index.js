export { bodyAnimationFinish } from "./animations/finish.js";

import { cssMs } from "../../utils/utility-animation.js";
import { delay } from "../../utils/utility-animation.js";
import { bodyAnimationIconPop } from "./animations/icon-pop.js";
import { bodyAnimationFinish } from "./animations/finish.js";
import { bodyAnimationMessageType } from "./animations/message-type.js";
import { BODY_ANIMATION_PENDING_CLASS } from "./constants.js";
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
export function bodyApply(isSignedIn) {
  const signedOutView = document.querySelector(BODY_SIGNED_OUT_VIEW_SELECTOR);
  const signedInView = document.querySelector(BODY_SIGNED_IN_VIEW_SELECTOR);

  signedOutView?.classList.toggle(BODY_HIDDEN_CLASS, isSignedIn);
  signedInView?.classList.toggle(BODY_HIDDEN_CLASS, !isSignedIn);

  if (isSignedIn) {
    document.querySelector(BODY_ROOT_SELECTOR)?.classList.remove(BODY_ACTIVE_CLASS);
  }
}

/** Hides the body empty-state content before the load intro finishes. */
export function bodyAnimationPrepare() {
  const body = document.querySelector(BODY_ROOT_SELECTOR);
  const signedOutView = document.querySelector(BODY_SIGNED_OUT_VIEW_SELECTOR);
  const signedInView = document.querySelector(BODY_SIGNED_IN_VIEW_SELECTOR);
  let content = null;

  if (!signedOutView?.classList.contains(BODY_HIDDEN_CLASS)) {
    content = document.querySelector(BODY_CONTENT_SIGNED_OUT_SELECTOR);
  } else {
    const codesList = document.querySelector(".codes-section__list");

    if (
      !signedInView?.classList.contains(BODY_HIDDEN_CLASS) &&
      (!codesList || codesList.classList.contains("hidden"))
    ) {
      content = document.querySelector(BODY_CONTENT_SIGNED_IN_SELECTOR);
    }
  }

  if (!body || !content) {
    return;
  }

  const signedIn = !signedInView?.classList.contains(BODY_HIDDEN_CLASS);
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

/** Runs the one-time body reveal sequence after the load intro finishes. */
export async function bodyAnimationRun() {
  const body = document.querySelector(BODY_ROOT_SELECTOR);
  const signedOutView = document.querySelector(BODY_SIGNED_OUT_VIEW_SELECTOR);
  const signedInView = document.querySelector(BODY_SIGNED_IN_VIEW_SELECTOR);
  let content = null;

  if (!signedOutView?.classList.contains(BODY_HIDDEN_CLASS)) {
    content = document.querySelector(BODY_CONTENT_SIGNED_OUT_SELECTOR);
  } else {
    const codesList = document.querySelector(".codes-section__list");

    if (
      !signedInView?.classList.contains(BODY_HIDDEN_CLASS) &&
      (!codesList || codesList.classList.contains("hidden"))
    ) {
      content = document.querySelector(BODY_CONTENT_SIGNED_IN_SELECTOR);
    }
  }

  if (!body) {
    return;
  }

  if (!content || !body.classList.contains(BODY_ANIMATION_PENDING_CLASS)) {
    bodyAnimationFinish();
    return;
  }

  try {
    await delay(cssMs(body, BODY_VAR_ANIMATION_TIMEOUT_BUFFER_MS));
    await bodyAnimationIconPop(content);
    await bodyAnimationMessageType(content);
    bodyAnimationFinish();
  } catch {
    bodyAnimationFinish();
  }
}
