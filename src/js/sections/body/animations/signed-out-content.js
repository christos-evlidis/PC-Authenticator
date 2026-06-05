import { cssMs } from "../../../utils/utility-animation.js";
import { delay } from "../../../utils/utility-animation.js";
import { waitForAnimationEnd } from "../../../utils/utility-animation.js";
import { BODY_ACTIVE_CLASS } from "../constants.js";
import { BODY_ANIMATION_TIMEOUT_BUFFER_MS } from "../constants.js";
import { BODY_CONTENT_SIGNED_OUT_SELECTOR } from "../constants.js";
import { BODY_ICON_SELECTOR } from "../constants.js";
import { BODY_MESSAGE_DISPLAY_SELECTOR } from "../constants.js";
import { BODY_MESSAGE_SPACER_SELECTOR } from "../constants.js";
import { BODY_MESSAGE_STACK_SELECTOR } from "../constants.js";
import { BODY_PENDING_CLASS } from "../constants.js";
import { BODY_ROOT_SELECTOR } from "../constants.js";
import { BODY_RUNNING_CLASS } from "../constants.js";
import { BODY_SIGNED_OUT_ICON_POP_CLASS } from "../constants.js";
import { BODY_SIGNED_OUT_MESSAGE_TEXT } from "../constants.js";
import { BODY_SIGNED_OUT_TEXT_TYPE_CLASS } from "../constants.js";
import { BODY_VAR_SIGNED_OUT_ICON_POP_MS } from "../constants.js";
import { BODY_VAR_SIGNED_OUT_TEXT_TYPE_MS } from "../constants.js";

/** Handles signed-out body content reset, animation, and static reveal. */
export async function bodyAnimateForSignedOutContent(options = {}) {
  const { reset = false, static: isStatic = false } = options;
  const content = document.querySelector(BODY_CONTENT_SIGNED_OUT_SELECTOR);
  const root = document.querySelector(BODY_ROOT_SELECTOR);
  const icon = content?.querySelector(BODY_ICON_SELECTOR);
  const stack = content?.querySelector(BODY_MESSAGE_STACK_SELECTOR);
  const spacer = stack?.querySelector(BODY_MESSAGE_SPACER_SELECTOR);
  const display = stack?.querySelector(BODY_MESSAGE_DISPLAY_SELECTOR);
  const stored = stack?.dataset?.fullText;
  const fullText = stored
    ? stored.replace(/\\n/g, "\n")
    : BODY_SIGNED_OUT_MESSAGE_TEXT;
  const lines = fullText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const messageHtml =
    lines.length <= 1
      ? fullText.trim()
      : `${lines[0]}<br>${lines.slice(1).join("<br>")}`;

  if (reset) {
    if (!stack || !spacer || !display) {
      return;
    }

    stack.dataset.fullText = fullText;

    if (typeof messageHtml === "string" && messageHtml.includes("<br>")) {
      spacer.innerHTML = messageHtml;
    } else {
      spacer.textContent = messageHtml;
    }

    display.textContent = "";
    display.classList.remove(BODY_RUNNING_CLASS, BODY_SIGNED_OUT_TEXT_TYPE_CLASS);
    display.removeAttribute("data-full-text");

    icon?.classList.remove(BODY_RUNNING_CLASS, BODY_ACTIVE_CLASS, BODY_SIGNED_OUT_ICON_POP_CLASS);
    icon?.classList.add(BODY_PENDING_CLASS);
    return;
  }

  if (isStatic) {
    root?.classList.remove(BODY_PENDING_CLASS);
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

    display.classList.remove(BODY_RUNNING_CLASS, BODY_SIGNED_OUT_TEXT_TYPE_CLASS);
    display.removeAttribute("data-full-text");

    icon?.classList.remove(BODY_PENDING_CLASS, BODY_RUNNING_CLASS, BODY_SIGNED_OUT_ICON_POP_CLASS);
    icon?.classList.add(BODY_ACTIVE_CLASS);
    return;
  }

  const iconPopMs = cssMs(root, BODY_VAR_SIGNED_OUT_ICON_POP_MS);
  const textTypeMs = cssMs(root, BODY_VAR_SIGNED_OUT_TEXT_TYPE_MS);

  if (icon) {
    icon.classList.remove(BODY_PENDING_CLASS);
    icon.classList.add(BODY_SIGNED_OUT_ICON_POP_CLASS);
    await waitForAnimationEnd(
      icon,
      "bodySignedOutIconPop",
      iconPopMs + BODY_ANIMATION_TIMEOUT_BUFFER_MS,
    );
    icon.classList.remove(BODY_SIGNED_OUT_ICON_POP_CLASS);
    icon.classList.add(BODY_ACTIVE_CLASS);
  }

  if (stack && display) {
    display.textContent = "";
    display.classList.add(BODY_SIGNED_OUT_TEXT_TYPE_CLASS, BODY_RUNNING_CLASS);

    const charCount = fullText.length;
    const stepMs = charCount > 0 ? textTypeMs / charCount : 0;

    for (let index = 1; index <= charCount; index += 1) {
      display.textContent = fullText.slice(0, index);

      if (index < charCount) {
        await delay(stepMs);
      }
    }

    display.classList.remove(BODY_SIGNED_OUT_TEXT_TYPE_CLASS, BODY_RUNNING_CLASS);

    if (typeof messageHtml === "string" && messageHtml.includes("<br>")) {
      display.innerHTML = messageHtml;
    } else {
      display.textContent = messageHtml;
    }
  }

  root?.classList.remove(BODY_PENDING_CLASS);
  root?.classList.add(BODY_ACTIVE_CLASS);
}
