import { bodyContentAnimate } from "./body-animate-content.js";
import { BODY_CONTENT_SIGNED_IN_EMPTY_SELECTOR } from "../body-constants.js";
import { BODY_SIGNED_IN_EMPTY_MESSAGE_TEXT } from "../body-constants.js";

/** Plays signed-in empty-codes icon pop and message typing animation. */
export async function bodyAnimateForSignedInContent() {
  const content = document.querySelector(BODY_CONTENT_SIGNED_IN_EMPTY_SELECTOR);

  await bodyContentAnimate(content, BODY_SIGNED_IN_EMPTY_MESSAGE_TEXT, {
    boldPlus: true,
  });
}
