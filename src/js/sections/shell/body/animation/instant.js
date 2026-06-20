import { BODY_ACTIVE_CLASS } from "../../../../const/const.body.js";
import { BODY_ANIMATION_PENDING_CLASS } from "../../../../const/const.body.js";
import { BODY_CONTENT_SIGNED_IN_SELECTOR } from "../../../../const/const.body.js";
import { BODY_CONTENT_SIGNED_OUT_SELECTOR } from "../../../../const/const.body.js";
import { BODY_HIDDEN_CLASS } from "../../../../const/const.body.js";
import { BODY_ICON_POP_PENDING_CLASS } from "../../../../const/const.body.js";
import { BODY_ICON_POP_REVEALED_CLASS } from "../../../../const/const.body.js";
import { BODY_ICON_SELECTOR } from "../../../../const/const.body.js";
import { BODY_MESSAGE_DISPLAY_SELECTOR } from "../../../../const/const.body.js";
import { BODY_MESSAGE_STACK_SELECTOR } from "../../../../const/const.body.js";
import { BODY_MESSAGE_TYPING_CLASS } from "../../../../const/const.body.js";
import { BODY_ROOT_SELECTOR } from "../../../../const/const.body.js";
import { BODY_SIGNED_IN_EMPTY_MESSAGE_TEXT } from "../../../../const/const.body.js";
import { BODY_SIGNED_IN_VIEW_SELECTOR } from "../../../../const/const.body.js";
import { BODY_SIGNED_OUT_MESSAGE_TEXT } from "../../../../const/const.body.js";
import { BODY_SIGNED_OUT_VIEW_SELECTOR } from "../../../../const/const.body.js";

function _bodyAnimationInstant() {
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

  body.classList.remove(BODY_HIDDEN_CLASS, BODY_ANIMATION_PENDING_CLASS);

  if (!content) {
    return;
  }

  const stack = content.querySelector(BODY_MESSAGE_STACK_SELECTOR);
  const display = content.querySelector(BODY_MESSAGE_DISPLAY_SELECTOR);
  const icon = content.querySelector(BODY_ICON_SELECTOR);
  const signedIn = !signedInView?.classList.contains(BODY_HIDDEN_CLASS);

  if (stack && display) {
    const stored = stack.dataset.fullText;
    const defaultText = signedIn
      ? BODY_SIGNED_IN_EMPTY_MESSAGE_TEXT
      : BODY_SIGNED_OUT_MESSAGE_TEXT;
    const fullText = stored ? stored.replace(/\\n/g, "\n") : defaultText;
    const lines = fullText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    let messageHtml = fullText.trim();

    if (lines.length > 1) {
      messageHtml = signedIn
        ? `${lines[0]}<br>${lines.slice(1).map((line) => line.replace(/\+/g, "<strong>+</strong>")).join("<br>")}`
        : `${lines[0]}<br>${lines.slice(1).join("<br>")}`;
    }

    display.classList.remove(BODY_MESSAGE_TYPING_CLASS);

    if (messageHtml.includes("<br>")) {
      display.innerHTML = messageHtml;
    } else {
      display.textContent = messageHtml;
    }
  }

  icon?.classList.remove(BODY_ICON_POP_PENDING_CLASS);
  icon?.classList.add(BODY_ICON_POP_REVEALED_CLASS, BODY_ACTIVE_CLASS);
  body.classList.add(BODY_ACTIVE_CLASS);
}

export { _bodyAnimationInstant as bodyAnimationInstant };
