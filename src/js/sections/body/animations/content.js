import { cssMs } from "../../../utils/utility-animation.js";
import { delay } from "../../../utils/utility-animation.js";
import { waitForAnimationEnd } from "../../../utils/utility-animation.js";
import { BODY_ACTIVE_CLASS } from "../constants.js";
import { BODY_ANIMATION_TIMEOUT_BUFFER_MS } from "../constants.js";
import { BODY_ICON_SELECTOR } from "../constants.js";
import { BODY_MESSAGE_DISPLAY_SELECTOR } from "../constants.js";
import { BODY_MESSAGE_SPACER_SELECTOR } from "../constants.js";
import { BODY_MESSAGE_STACK_SELECTOR } from "../constants.js";
import { BODY_PENDING_CLASS } from "../constants.js";
import { BODY_ROOT_SELECTOR } from "../constants.js";
import { BODY_RUNNING_CLASS } from "../constants.js";

/** Resolves message copy from the stack dataset or a default string. */
function resolveMessageText(stack, defaultMessage) {
  const stored = stack?.dataset?.fullText;

  return stored ? stored.replace(/\\n/g, "\n") : defaultMessage;
}

/** Builds single- or multi-line HTML for the message stack spacer and display. */
function buildMessageHtml(fullText, formatContinuationLine) {
  const lines = fullText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length <= 1) {
    return fullText.trim();
  }

  return `${lines[0]}<br>${lines.slice(1).map(formatContinuationLine).join("<br>")}`;
}

/** Writes message HTML or text into an element. */
function applyMessageContent(element, messageHtml) {
  if (typeof messageHtml === "string" && messageHtml.includes("<br>")) {
    element.innerHTML = messageHtml;
  } else {
    element.textContent = messageHtml;
  }
}

/** Resets icon and message elements to the pending pre-animation state. */
function resetContentElements({ stack, spacer, display, icon, fullText, messageHtml, textTypeClass, iconPopClass }) {
  stack.dataset.fullText = fullText;
  applyMessageContent(spacer, messageHtml);

  display.textContent = "";
  display.classList.remove(BODY_RUNNING_CLASS, textTypeClass);
  display.removeAttribute("data-full-text");

  icon?.classList.remove(BODY_RUNNING_CLASS, BODY_ACTIVE_CLASS, iconPopClass);
  icon?.classList.add(BODY_PENDING_CLASS);
}

/** Reveals icon and message immediately without playing animations. */
function revealContentStatic({ root, stack, spacer, display, icon, fullText, messageHtml, textTypeClass, iconPopClass }) {
  root?.classList.remove(BODY_PENDING_CLASS);
  root?.classList.add(BODY_ACTIVE_CLASS);

  stack.dataset.fullText = fullText;
  applyMessageContent(spacer, messageHtml);
  applyMessageContent(display, messageHtml);

  display.classList.remove(BODY_RUNNING_CLASS, textTypeClass);
  display.removeAttribute("data-full-text");

  icon?.classList.remove(BODY_PENDING_CLASS, BODY_RUNNING_CLASS, iconPopClass);
  icon?.classList.add(BODY_ACTIVE_CLASS);
}

/** Plays the icon pop and typewriter message sequence for one body content view. */
async function playContentAnimation({
  root,
  stack,
  display,
  icon,
  fullText,
  messageHtml,
  iconPopClass,
  textTypeClass,
  iconPopMsVar,
  textTypeMsVar,
  iconPopAnimation,
}) {
  const iconPopMs = cssMs(root, iconPopMsVar);
  const textTypeMs = cssMs(root, textTypeMsVar);

  if (icon) {
    icon.classList.remove(BODY_PENDING_CLASS);
    icon.classList.add(iconPopClass);
    await waitForAnimationEnd(
      icon,
      iconPopAnimation,
      iconPopMs + BODY_ANIMATION_TIMEOUT_BUFFER_MS,
    );
    icon.classList.remove(iconPopClass);
    icon.classList.add(BODY_ACTIVE_CLASS);
  }

  if (stack && display) {
    display.textContent = "";
    display.classList.add(textTypeClass, BODY_RUNNING_CLASS);

    const charCount = fullText.length;
    const stepMs = charCount > 0 ? textTypeMs / charCount : 0;

    for (let index = 1; index <= charCount; index += 1) {
      display.textContent = fullText.slice(0, index);

      if (index < charCount) {
        await delay(stepMs);
      }
    }

    display.classList.remove(textTypeClass, BODY_RUNNING_CLASS);
    applyMessageContent(display, messageHtml);
  }

  root?.classList.remove(BODY_PENDING_CLASS);
  root?.classList.add(BODY_ACTIVE_CLASS);
}

/**
 * Runs reset, static reveal, or animated reveal for a signed-in/out body content view.
 *
 * @param {object} config
 * @param {object} [options]
 * @param {boolean} [options.reset]
 * @param {boolean} [options.static]
 */
export async function bodyAnimateForContent(config, options = {}) {
  const { reset = false, static: isStatic = false } = options;
  const content = document.querySelector(config.contentSelector);
  const root = document.querySelector(BODY_ROOT_SELECTOR);
  const icon = content?.querySelector(BODY_ICON_SELECTOR);
  const stack = content?.querySelector(BODY_MESSAGE_STACK_SELECTOR);
  const spacer = stack?.querySelector(BODY_MESSAGE_SPACER_SELECTOR);
  const display = stack?.querySelector(BODY_MESSAGE_DISPLAY_SELECTOR);
  const fullText = resolveMessageText(stack, config.defaultMessage);
  const messageHtml = buildMessageHtml(fullText, config.formatContinuationLine);

  const elements = {
    root,
    stack,
    spacer,
    display,
    icon,
    fullText,
    messageHtml,
    iconPopClass: config.iconPopClass,
    textTypeClass: config.textTypeClass,
    iconPopMsVar: config.iconPopMsVar,
    textTypeMsVar: config.textTypeMsVar,
    iconPopAnimation: config.iconPopAnimation,
  };

  if (reset) {
    if (!stack || !spacer || !display) {
      return;
    }

    resetContentElements(elements);
    return;
  }

  if (isStatic) {
    if (!stack || !spacer || !display) {
      return;
    }

    revealContentStatic(elements);
    return;
  }

  await playContentAnimation(elements);
}
