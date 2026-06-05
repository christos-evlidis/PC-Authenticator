import { BODY_ACTIVE_CLASS } from "./constants.js";
import { BODY_CONTENT_SIGNED_IN_SELECTOR } from "./constants.js";
import { BODY_CONTENT_SIGNED_OUT_SELECTOR } from "./constants.js";
import { BODY_ICON_SELECTOR } from "./constants.js";
import { BODY_MESSAGE_DISPLAY_SELECTOR } from "./constants.js";
import { BODY_MESSAGE_SPACER_SELECTOR } from "./constants.js";
import { BODY_MESSAGE_STACK_SELECTOR } from "./constants.js";
import { BODY_ROOT_SELECTOR } from "./constants.js";
import { BODY_SIGNED_IN_EMPTY_MESSAGE_TEXT } from "./constants.js";
import { BODY_SIGNED_OUT_MESSAGE_TEXT } from "./constants.js";

function buildMessageHtml(fullText, signedIn) {
  const lines = fullText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length <= 1) {
    return fullText.trim();
  }

  if (signedIn) {
    return `${lines[0]}<br>${lines.slice(1).map((line) => line.replace(/\+/g, "<strong>+</strong>")).join("<br>")}`;
  }

  return `${lines[0]}<br>${lines.slice(1).join("<br>")}`;
}

/** Shows the signed-in/out empty-state message immediately. */
export function bodyRevealMessage({ signedIn = false } = {}) {
  const contentSelector = signedIn
    ? BODY_CONTENT_SIGNED_IN_SELECTOR
    : BODY_CONTENT_SIGNED_OUT_SELECTOR;
  const defaultText = signedIn
    ? BODY_SIGNED_IN_EMPTY_MESSAGE_TEXT
    : BODY_SIGNED_OUT_MESSAGE_TEXT;
  const content = document.querySelector(contentSelector);
  const root = document.querySelector(BODY_ROOT_SELECTOR);
  const icon = content?.querySelector(BODY_ICON_SELECTOR);
  const stack = content?.querySelector(BODY_MESSAGE_STACK_SELECTOR);
  const spacer = stack?.querySelector(BODY_MESSAGE_SPACER_SELECTOR);
  const display = stack?.querySelector(BODY_MESSAGE_DISPLAY_SELECTOR);
  const stored = stack?.dataset?.fullText;
  const fullText = stored ? stored.replace(/\\n/g, "\n") : defaultText;
  const messageHtml = buildMessageHtml(fullText, signedIn);

  root?.classList.add(BODY_ACTIVE_CLASS);

  if (!stack || !spacer || !display) {
    return;
  }

  stack.dataset.fullText = fullText;

  if (typeof messageHtml === "string" && messageHtml.includes("<br>")) {
    spacer.innerHTML = messageHtml;
    display.innerHTML = messageHtml;
  } else {
    spacer.textContent = messageHtml;
    display.textContent = messageHtml;
  }

  icon?.classList.add(BODY_ACTIVE_CLASS);
}
