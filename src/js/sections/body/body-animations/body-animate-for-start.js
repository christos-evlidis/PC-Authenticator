import { themeApplySplashLogo } from "../../../utils/utility-theme.js";
import { themeRead } from "../../../utils/utility-theme.js";
import { BODY_ACTIVE_CLASS } from "../body-constants.js";
import { BODY_CONTENT_SELECTOR } from "../body-constants.js";
import { BODY_ICON_SELECTOR } from "../body-constants.js";
import { BODY_INTRO_FULLBLEED_CLASS } from "../body-constants.js";
import { BODY_MESSAGE_DISPLAY_SELECTOR } from "../body-constants.js";
import { BODY_MESSAGE_SPACER_SELECTOR } from "../body-constants.js";
import { BODY_MESSAGE_STACK_SELECTOR } from "../body-constants.js";
import { BODY_PENDING_CLASS } from "../body-constants.js";
import { BODY_POPPING_CLASS } from "../body-constants.js";
import { BODY_ROOT_SELECTOR } from "../body-constants.js";
import { BODY_RUNNING_CLASS } from "../body-constants.js";
import { BODY_SIGNED_OUT_MESSAGE_TEXT } from "../body-constants.js";
import { BODY_TYPING_CLASS } from "../body-constants.js";
import { EXTENSION_FRAME_SELECTOR } from "../body-constants.js";
import { FRAME_INTRO_CLASS } from "../body-constants.js";

/** Resets signed-out body chrome to the pre-intro hidden state. */
export function bodyAnimateForStart() {
  themeApplySplashLogo(themeRead());

  const frame = document.querySelector(EXTENSION_FRAME_SELECTOR);
  const root = document.querySelector(BODY_ROOT_SELECTOR);
  const content = document.querySelector(BODY_CONTENT_SELECTOR);
  const icon = content?.querySelector(BODY_ICON_SELECTOR);
  const stack = content?.querySelector(BODY_MESSAGE_STACK_SELECTOR);
  const spacer = stack?.querySelector(BODY_MESSAGE_SPACER_SELECTOR);
  const display = stack?.querySelector(BODY_MESSAGE_DISPLAY_SELECTOR);

  frame?.classList.add(FRAME_INTRO_CLASS);
  root?.classList.add(BODY_INTRO_FULLBLEED_CLASS);

  root?.classList.remove(BODY_ACTIVE_CLASS);
  root?.classList.add(BODY_PENDING_CLASS);

  if (stack && spacer && display) {
    const stored = stack.dataset?.fullText;
    const fullText = stored
      ? stored.replace(/\\n/g, "\n")
      : BODY_SIGNED_OUT_MESSAGE_TEXT;
    const lines = fullText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    stack.dataset.fullText = fullText;

    if (lines.length > 1) {
      spacer.innerHTML = `${lines[0]}<br>${lines.slice(1).join("<br>")}`;
    } else {
      spacer.textContent = fullText.trim();
    }

    display.textContent = "";
    display.classList.remove(BODY_RUNNING_CLASS, BODY_TYPING_CLASS);
    display.removeAttribute("data-full-text");
  }

  icon?.classList.remove(BODY_RUNNING_CLASS, BODY_ACTIVE_CLASS, BODY_POPPING_CLASS);
  icon?.classList.add(BODY_PENDING_CLASS);
}
