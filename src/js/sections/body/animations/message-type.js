import { cssMs } from "../../../utils/utility-animation.js";
import { delay } from "../../../utils/utility-animation.js";
import { BODY_MESSAGE_DISPLAY_SELECTOR } from "../constants.js";
import { BODY_MESSAGE_SPACER_SELECTOR } from "../constants.js";
import { BODY_MESSAGE_STACK_SELECTOR } from "../constants.js";
import { BODY_MESSAGE_TYPING_CLASS } from "../constants.js";
import { BODY_ROOT_SELECTOR } from "../constants.js";
import { BODY_SIGNED_IN_EMPTY_MESSAGE_TEXT } from "../constants.js";
import { BODY_SIGNED_IN_VIEW_SELECTOR } from "../constants.js";
import { BODY_SIGNED_OUT_MESSAGE_TEXT } from "../constants.js";
import { BODY_VAR_MESSAGE_TYPE_MS } from "../constants.js";
import { BODY_HIDDEN_CLASS } from "../constants.js";

/** Types the body empty-state message over the configured duration. */
export async function bodyAnimationMessageType(content) {
  const body = document.querySelector(BODY_ROOT_SELECTOR);
  const stack = content?.querySelector(BODY_MESSAGE_STACK_SELECTOR);
  const spacer = content?.querySelector(BODY_MESSAGE_SPACER_SELECTOR);
  const display = content?.querySelector(BODY_MESSAGE_DISPLAY_SELECTOR);

  if (!body || !stack || !spacer || !display) {
    return;
  }

  const signedIn = !document
    .querySelector(BODY_SIGNED_IN_VIEW_SELECTOR)
    ?.classList.contains(BODY_HIDDEN_CLASS);
  const stored = stack.dataset.fullText;
  const defaultText = signedIn
    ? BODY_SIGNED_IN_EMPTY_MESSAGE_TEXT
    : BODY_SIGNED_OUT_MESSAGE_TEXT;
  const fullText = stored ? stored.replace(/\\n/g, "\n") : defaultText;

  spacer.textContent = fullText;

  const typeMs = cssMs(body, BODY_VAR_MESSAGE_TYPE_MS);
  const charCount = fullText.length;
  const stepMs = charCount > 0 ? typeMs / charCount : typeMs;

  display.textContent = "";
  display.classList.add(BODY_MESSAGE_TYPING_CLASS);

  for (let index = 0; index < charCount; index += 1) {
    display.textContent = fullText.slice(0, index + 1);
    await delay(stepMs);
  }

  display.classList.remove(BODY_MESSAGE_TYPING_CLASS);
}
