import { BODY_ACTIVE_CLASS } from "../body/constants.js";
import { BODY_ANIMATION_PENDING_CLASS } from "../body/constants.js";
import { BODY_CONTENT_SIGNED_IN_SELECTOR } from "../body/constants.js";
import { BODY_ICON_POP_PENDING_CLASS } from "../body/constants.js";
import { BODY_ICON_POP_REVEALED_CLASS } from "../body/constants.js";
import { BODY_ICON_SELECTOR } from "../body/constants.js";
import { BODY_MESSAGE_DISPLAY_SELECTOR } from "../body/constants.js";
import { BODY_MESSAGE_SPACER_SELECTOR } from "../body/constants.js";
import { BODY_MESSAGE_STACK_SELECTOR } from "../body/constants.js";
import { BODY_MESSAGE_TYPING_CLASS } from "../body/constants.js";
import { BODY_ROOT_SELECTOR } from "../body/constants.js";
import { BODY_SIGNED_IN_EMPTY_MESSAGE_TEXT } from "../body/constants.js";
import { SELECTORS } from "./codes-state.js";

export function setEmptyVisible(empty, list, isEmpty) {
  const codesSection = document.querySelector(SELECTORS.section);

  empty?.classList.toggle("hidden", !isEmpty);
  codesSection?.classList.toggle("hidden", isEmpty);
  list?.classList.toggle("hidden", isEmpty);
}

export function prepareCodesEmptyIntro() {
  revealCodesEmptyStatic();
}

export function revealCodesEmptyStatic() {
  const root = document.querySelector(BODY_ROOT_SELECTOR);

  if (root?.classList.contains(BODY_ANIMATION_PENDING_CLASS)) {
    return;
  }

  const content = document.querySelector(BODY_CONTENT_SIGNED_IN_SELECTOR);
  const icon = content?.querySelector(BODY_ICON_SELECTOR);
  const stack = content?.querySelector(BODY_MESSAGE_STACK_SELECTOR);
  const spacer = stack?.querySelector(BODY_MESSAGE_SPACER_SELECTOR);
  const display = stack?.querySelector(BODY_MESSAGE_DISPLAY_SELECTOR);
  const stored = stack?.dataset?.fullText;
  const fullText = stored ? stored.replace(/\\n/g, "\n") : BODY_SIGNED_IN_EMPTY_MESSAGE_TEXT;
  const lines = fullText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const messageHtml =
    lines.length > 1
      ? `${lines[0]}<br>${lines.slice(1).map((line) => line.replace(/\+/g, "<strong>+</strong>")).join("<br>")}`
      : fullText.trim();

  root?.classList.remove(BODY_ANIMATION_PENDING_CLASS);
  root?.classList.add(BODY_ACTIVE_CLASS);
  icon?.classList.remove(BODY_ICON_POP_PENDING_CLASS);
  icon?.classList.add(BODY_ICON_POP_REVEALED_CLASS);
  display?.classList.remove(BODY_MESSAGE_TYPING_CLASS);

  if (stack && spacer && display) {
    stack.dataset.fullText = fullText;

    if (messageHtml.includes("<br>")) {
      spacer.innerHTML = messageHtml;
      display.innerHTML = messageHtml;
    } else {
      spacer.textContent = messageHtml;
      display.textContent = messageHtml;
    }
  }

  icon?.classList.add(BODY_ACTIVE_CLASS);
}
