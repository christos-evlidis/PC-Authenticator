import {
  EMPTY_SIGNED_IN_ICON_CLASS,
  EMPTY_SIGNED_IN_MESSAGE,
  SELECTORS,
} from "./codes-state.js";

export function setEmptyVisible(empty, list, isEmpty) {
  empty?.classList.toggle("hidden", !isEmpty);
  list?.classList.toggle("hidden", isEmpty);
}

function getEmptyMessageElements(
  empty = document.querySelector(SELECTORS.empty),
) {
  const stack = empty?.querySelector(".codes-section__message-stack");

  if (!stack) {
    return null;
  }

  return {
    stack,
    spacer: stack.querySelector(".codes-section__message--spacer"),
    display: stack.querySelector(".codes-section__message--display"),
  };
}

function getEmptyFullText(stackEl) {
  const stored = stackEl?.dataset.fullText;

  if (stored) {
    return stored.replace(/\\n/g, "\n");
  }

  return EMPTY_SIGNED_IN_MESSAGE;
}

function formatEmptyMessageLine(line) {
  return line.replace(/\+/g, "<strong>+</strong>");
}

function setEmptyMessageHtml(message, fullText) {
  const lines = fullText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length > 1) {
    message.innerHTML = `${lines[0]}<br>${formatEmptyMessageLine(lines[1])}`;
  } else {
    message.textContent = fullText.trim();
  }
}

function applySignedInEmptyIcon(icon) {
  const iconElement = icon?.querySelector("i");

  if (!iconElement) {
    return;
  }

  iconElement.className = `fas ${EMPTY_SIGNED_IN_ICON_CLASS}`;
}

export function prepareCodesEmptyIntro() {
  revealCodesEmptyStatic();
}

export function revealCodesEmptyStatic() {
  const empty = document.querySelector(SELECTORS.empty);
  const icon = empty?.querySelector(".codes-section__empty-icon");
  const messages = getEmptyMessageElements(empty);

  if (!messages?.spacer || !messages.display) {
    return;
  }

  const { stack, spacer, display } = messages;
  const fullText = getEmptyFullText(stack);

  applySignedInEmptyIcon(icon);
  setEmptyMessageHtml(spacer, fullText);
  setEmptyMessageHtml(display, fullText);
  icon?.classList.remove("is-pop-pending", "is-pop-active");
  icon?.classList.add("is-pop-revealed");
  display.classList.remove("is-intro-typing");
}

export async function playCodesEmptyIntro() {
  revealCodesEmptyStatic();
}
