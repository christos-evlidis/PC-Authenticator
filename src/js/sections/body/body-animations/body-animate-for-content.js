import { cssMs } from "../../../utils/utility-animation.js";
import { delay } from "../../../utils/utility-animation.js";
import { waitForAnimationEnd } from "../../../utils/utility-animation.js";
import { BODY_ACTIVE_CLASS } from "../body-constants.js";
import { BODY_ANIMATION_TIMEOUT_BUFFER_MS } from "../body-constants.js";
import { BODY_CONTENT_SELECTOR } from "../body-constants.js";
import { BODY_ICON_SELECTOR } from "../body-constants.js";
import { BODY_MESSAGE_DISPLAY_SELECTOR } from "../body-constants.js";
import { BODY_MESSAGE_STACK_SELECTOR } from "../body-constants.js";
import { BODY_PENDING_CLASS } from "../body-constants.js";
import { BODY_POPPING_CLASS } from "../body-constants.js";
import { BODY_ROOT_SELECTOR } from "../body-constants.js";
import { BODY_RUNNING_CLASS } from "../body-constants.js";
import { BODY_SIGNED_OUT_MESSAGE_TEXT } from "../body-constants.js";
import { BODY_TYPING_CLASS } from "../body-constants.js";
import { BODY_VAR_ICON_POP_MS } from "../body-constants.js";
import { BODY_VAR_MESSAGE_TYPE_MS } from "../body-constants.js";

/** Plays signed-out icon pop and message typing animation. */
export async function bodyAnimateForContent() {
  const root = document.querySelector(BODY_ROOT_SELECTOR);
  const content = document.querySelector(BODY_CONTENT_SELECTOR);
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
    const stored = stack.dataset?.fullText;
    const fullText = stored
      ? stored.replace(/\\n/g, "\n")
      : BODY_SIGNED_OUT_MESSAGE_TEXT;
    const lines = fullText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

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

    if (lines.length > 1) {
      display.innerHTML = `${lines[0]}<br>${lines.slice(1).join("<br>")}`;
    } else {
      display.textContent = fullText.trim();
    }
  }

  root?.classList.remove(BODY_PENDING_CLASS);
  root?.classList.add(BODY_ACTIVE_CLASS);
}
