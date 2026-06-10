import { BODY_ANIMATION_PENDING_CLASS } from "../constants.js";
import { BODY_CONTENT_HIDDEN_CLASS } from "../constants.js";
import { BODY_CONTENT_SIGNED_IN_SELECTOR } from "../constants.js";
import { BODY_CONTENT_SIGNED_OUT_SELECTOR } from "../constants.js";
import { BODY_HIDDEN_CLASS } from "../constants.js";
import { BODY_ICON_POP_PENDING_CLASS } from "../constants.js";
import { BODY_ICON_POP_REVEALED_CLASS } from "../constants.js";
import { BODY_ICON_SELECTOR } from "../constants.js";
import { BODY_MESSAGE_DISPLAY_SELECTOR } from "../constants.js";
import { BODY_MESSAGE_SPACER_SELECTOR } from "../constants.js";
import { BODY_MESSAGE_STACK_SELECTOR } from "../constants.js";
import { BODY_ROOT_SELECTOR } from "../constants.js";
import { BODY_SIGNED_IN_EMPTY_MESSAGE_TEXT } from "../constants.js";
import { BODY_SIGNED_IN_VIEW_SELECTOR } from "../constants.js";
import { BODY_SIGNED_OUT_MESSAGE_TEXT } from "../constants.js";
import { BODY_ACTIVE_CLASS } from "../constants.js";
import { BODY_SIGNED_OUT_VIEW_SELECTOR } from "../constants.js";

/** Hides the body empty-state content before an intro reveal sequence. */
function bodyAnimationReset() {
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

export { bodyAnimationReset };
