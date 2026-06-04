import { bodyContentAnimate } from "./body-animate-content.js";
import { BODY_CONTENT_SELECTOR } from "../body-constants.js";
import { BODY_SIGNED_OUT_MESSAGE_TEXT } from "../body-constants.js";

/** Plays signed-out icon pop and message typing animation. */
export async function bodyAnimateForContent() {
  const content = document.querySelector(BODY_CONTENT_SELECTOR);

  await bodyContentAnimate(content, BODY_SIGNED_OUT_MESSAGE_TEXT);
}
