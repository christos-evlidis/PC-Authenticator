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
import { BODY_TYPING_CLASS } from "../body-constants.js";
import { BODY_VAR_ICON_POP_MS } from "../body-constants.js";
import { BODY_VAR_MESSAGE_TYPE_MS } from "../body-constants.js";
import { bodyMessageDisplayApply } from "../body-render/body-message.js";
import { bodyMessageFullText } from "../body-render/body-message.js";

/** Types message text character by character over the given duration. */
async function bodyMessageTypeAnimation(display, fullText, totalMs) {
  if (!display || !fullText) {
    return;
  }

  display.textContent = "";
  display.classList.add(BODY_TYPING_CLASS, BODY_RUNNING_CLASS);

  const charCount = fullText.length;
  const stepMs = charCount > 0 ? totalMs / charCount : 0;

  for (let index = 1; index <= charCount; index += 1) {
    display.textContent = fullText.slice(0, index);

    if (index < charCount) {
      await delay(stepMs);
    }
  }

  display.classList.remove(BODY_TYPING_CLASS);
}

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
    const fullText = bodyMessageFullText(stack);

    await bodyMessageTypeAnimation(display, fullText, messageTypeMs);

    display.classList.remove(BODY_RUNNING_CLASS);
    bodyMessageDisplayApply(display, fullText);
  }

  root?.classList.remove(BODY_PENDING_CLASS);
  root?.classList.add(BODY_ACTIVE_CLASS);
}
