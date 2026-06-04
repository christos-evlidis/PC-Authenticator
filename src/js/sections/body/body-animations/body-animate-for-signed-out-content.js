import { bodyContentAnimate } from "./body-animate-content.js";
import { bodyContentResetStart } from "./body-animate-content.js";
import { bodyContentStatic } from "./body-animate-content.js";
import { BODY_CONTENT_SELECTOR } from "../body-constants.js";
import { BODY_SIGNED_OUT_MESSAGE_TEXT } from "../body-constants.js";

function getSignedOutContent() {
  return document.querySelector(BODY_CONTENT_SELECTOR);
}

/** Resets signed-out body content to the pre-intro hidden state. */
export function bodyAnimateForSignedOutStart() {
  bodyContentResetStart(getSignedOutContent(), BODY_SIGNED_OUT_MESSAGE_TEXT);
}

/** Plays signed-out icon pop and message typing animation. */
export async function bodyAnimateForSignedOutContent() {
  await bodyContentAnimate(getSignedOutContent(), BODY_SIGNED_OUT_MESSAGE_TEXT);
}

/** Shows signed-out icon and message immediately without animation. */
export function bodyAnimateForSignedOutStatic() {
  bodyContentStatic(getSignedOutContent(), BODY_SIGNED_OUT_MESSAGE_TEXT);
}
