import { BODY_ACTIVE_CLASS } from "../body-constants.js";
import { BODY_CONTENT_SELECTOR } from "../body-constants.js";
import { BODY_ICON_SELECTOR } from "../body-constants.js";
import { BODY_MESSAGE_DISPLAY_SELECTOR } from "../body-constants.js";
import { BODY_MESSAGE_SPACER_SELECTOR } from "../body-constants.js";
import { BODY_MESSAGE_STACK_SELECTOR } from "../body-constants.js";
import { BODY_PENDING_CLASS } from "../body-constants.js";
import { BODY_POPPING_CLASS } from "../body-constants.js";
import { BODY_ROOT_SELECTOR } from "../body-constants.js";
import { BODY_RUNNING_CLASS } from "../body-constants.js";
import { BODY_TYPING_CLASS } from "../body-constants.js";
import { bodyMessageDisplayApply } from "../body-render/body-message.js";
import { bodyMessageFullText } from "../body-render/body-message.js";
import { bodyMessageSpacerApply } from "../body-render/body-message.js";

/** Shows icon and message immediately without animation. */
export function bodyAnimateForStatic() {
  const root = document.querySelector(BODY_ROOT_SELECTOR);
  const content = document.querySelector(BODY_CONTENT_SELECTOR);
  const icon = content?.querySelector(BODY_ICON_SELECTOR);
  const stack = content?.querySelector(BODY_MESSAGE_STACK_SELECTOR);
  const spacer = stack?.querySelector(BODY_MESSAGE_SPACER_SELECTOR);
  const display = stack?.querySelector(BODY_MESSAGE_DISPLAY_SELECTOR);

  root?.classList.remove(BODY_PENDING_CLASS);
  root?.classList.add(BODY_ACTIVE_CLASS);

  if (stack && spacer && display) {
    const fullText = bodyMessageFullText(stack);

    stack.dataset.fullText = fullText;
    bodyMessageSpacerApply(spacer, fullText);
    bodyMessageDisplayApply(display, fullText);

    display.classList.remove(BODY_RUNNING_CLASS, BODY_TYPING_CLASS);
    display.removeAttribute("data-full-text");
  }

  icon?.classList.remove(BODY_PENDING_CLASS, BODY_RUNNING_CLASS, BODY_POPPING_CLASS);
  icon?.classList.add(BODY_ACTIVE_CLASS);
}
