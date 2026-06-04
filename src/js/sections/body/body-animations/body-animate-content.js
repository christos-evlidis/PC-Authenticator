import { cssMs } from "../../../utils/utility-animation.js";
import { delay } from "../../../utils/utility-animation.js";
import { waitForAnimationEnd } from "../../../utils/utility-animation.js";
import { BODY_ACTIVE_CLASS } from "../body-constants.js";
import { BODY_ANIMATION_TIMEOUT_BUFFER_MS } from "../body-constants.js";
import { BODY_ICON_SELECTOR } from "../body-constants.js";
import { BODY_MESSAGE_DISPLAY_SELECTOR } from "../body-constants.js";
import { BODY_MESSAGE_SPACER_SELECTOR } from "../body-constants.js";
import { BODY_MESSAGE_STACK_SELECTOR } from "../body-constants.js";
import { BODY_PENDING_CLASS } from "../body-constants.js";
import { BODY_POPPING_CLASS } from "../body-constants.js";
import { BODY_ROOT_SELECTOR } from "../body-constants.js";
import { BODY_RUNNING_CLASS } from "../body-constants.js";
import { BODY_TYPING_CLASS } from "../body-constants.js";
import { BODY_VAR_ICON_POP_MS } from "../body-constants.js";
import { BODY_VAR_MESSAGE_TYPE_MS } from "../body-constants.js";

function getFullText(stack, fallbackMessage) {
  const stored = stack?.dataset?.fullText;

  if (stored) {
    return stored.replace(/\\n/g, "\n");
  }

  return fallbackMessage;
}

function formatMessageHtml(fullText, boldPlus) {
  const lines = fullText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length <= 1) {
    return fullText.trim();
  }

  const formatLine = (line) =>
    boldPlus ? line.replace(/\+/g, "<strong>+</strong>") : line;

  return `${lines[0]}<br>${lines.slice(1).map(formatLine).join("<br>")}`;
}

/** Resets a body content block to the pre-intro hidden state. */
export function bodyContentResetStart(content, fallbackMessage) {
  const icon = content?.querySelector(BODY_ICON_SELECTOR);
  const stack = content?.querySelector(BODY_MESSAGE_STACK_SELECTOR);
  const spacer = stack?.querySelector(BODY_MESSAGE_SPACER_SELECTOR);
  const display = stack?.querySelector(BODY_MESSAGE_DISPLAY_SELECTOR);

  if (!stack || !spacer || !display) {
    return;
  }

  const fullText = getFullText(stack, fallbackMessage);
  const messageHtml = formatMessageHtml(fullText, false);

  stack.dataset.fullText = fullText;

  if (typeof messageHtml === "string" && messageHtml.includes("<br>")) {
    spacer.innerHTML = messageHtml;
  } else {
    spacer.textContent = messageHtml;
  }

  display.textContent = "";
  display.classList.remove(BODY_RUNNING_CLASS, BODY_TYPING_CLASS);
  display.removeAttribute("data-full-text");

  icon?.classList.remove(BODY_RUNNING_CLASS, BODY_ACTIVE_CLASS, BODY_POPPING_CLASS);
  icon?.classList.add(BODY_PENDING_CLASS);
}

/** Plays icon pop and message typing animation for a body content block. */
export async function bodyContentAnimate(content, fallbackMessage, options = {}) {
  const { boldPlus = false } = options;
  const root = document.querySelector(BODY_ROOT_SELECTOR);
  const icon = content?.querySelector(BODY_ICON_SELECTOR);
  const stack = content?.querySelector(BODY_MESSAGE_STACK_SELECTOR);
  const display = stack?.querySelector(BODY_MESSAGE_DISPLAY_SELECTOR);
  const iconPopMs = cssMs(root, BODY_VAR_ICON_POP_MS);
  const messageTypeMs = cssMs(root, BODY_VAR_MESSAGE_TYPE_MS);

  if (icon) {
    icon.classList.remove(BODY_PENDING_CLASS);
    icon.classList.add(BODY_POPPING_CLASS);
    await waitForAnimationEnd(
      icon,
      "bodyIconPop",
      iconPopMs + BODY_ANIMATION_TIMEOUT_BUFFER_MS,
    );
    icon.classList.remove(BODY_POPPING_CLASS);
    icon.classList.add(BODY_ACTIVE_CLASS);
  }

  if (stack && display) {
    const fullText = getFullText(stack, fallbackMessage);
    const messageHtml = formatMessageHtml(fullText, boldPlus);

    display.textContent = "";
    display.classList.add(BODY_TYPING_CLASS, BODY_RUNNING_CLASS);

    const charCount = fullText.length;
    const stepMs = charCount > 0 ? messageTypeMs / charCount : 0;

    for (let index = 1; index <= charCount; index += 1) {
      display.textContent = fullText.slice(0, index);

      if (index < charCount) {
        await delay(stepMs);
      }
    }

    display.classList.remove(BODY_TYPING_CLASS, BODY_RUNNING_CLASS);

    if (typeof messageHtml === "string" && messageHtml.includes("<br>")) {
      display.innerHTML = messageHtml;
    } else {
      display.textContent = messageHtml;
    }
  }

  root?.classList.remove(BODY_PENDING_CLASS);
  root?.classList.add(BODY_ACTIVE_CLASS);
}

/** Shows icon and message immediately without animation. */
export function bodyContentStatic(content, fallbackMessage, options = {}) {
  const { boldPlus = false } = options;
  const root = document.querySelector(BODY_ROOT_SELECTOR);
  const icon = content?.querySelector(BODY_ICON_SELECTOR);
  const stack = content?.querySelector(BODY_MESSAGE_STACK_SELECTOR);
  const spacer = stack?.querySelector(BODY_MESSAGE_SPACER_SELECTOR);
  const display = stack?.querySelector(BODY_MESSAGE_DISPLAY_SELECTOR);

  root?.classList.remove(BODY_PENDING_CLASS);
  root?.classList.add(BODY_ACTIVE_CLASS);

  if (!stack || !spacer || !display) {
    return;
  }

  const fullText = getFullText(stack, fallbackMessage);
  const messageHtml = formatMessageHtml(fullText, boldPlus);

  stack.dataset.fullText = fullText;

  if (typeof messageHtml === "string" && messageHtml.includes("<br>")) {
    spacer.innerHTML = messageHtml;
    display.innerHTML = messageHtml;
  } else {
    spacer.textContent = messageHtml;
    display.textContent = messageHtml;
  }

  display.classList.remove(BODY_RUNNING_CLASS, BODY_TYPING_CLASS);
  display.removeAttribute("data-full-text");

  icon?.classList.remove(BODY_PENDING_CLASS, BODY_RUNNING_CLASS, BODY_POPPING_CLASS);
  icon?.classList.add(BODY_ACTIVE_CLASS);
}
