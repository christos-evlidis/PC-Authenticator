import { bodyContentAnimate } from "./body-animate-content.js";
import { bodyContentResetStart } from "./body-animate-content.js";
import { bodyContentStatic } from "./body-animate-content.js";
import { BODY_CONTENT_SIGNED_IN_EMPTY_SELECTOR } from "../body-constants.js";
import { BODY_SIGNED_IN_EMPTY_MESSAGE_TEXT } from "../body-constants.js";

const SIGNED_IN_CONTENT_OPTIONS = { boldPlus: true };

function getSignedInContent() {
  return document.querySelector(BODY_CONTENT_SIGNED_IN_EMPTY_SELECTOR);
}

/** Resets signed-in empty-codes body content to the pre-intro hidden state. */
export function bodyAnimateForSignedInStart() {
  bodyContentResetStart(
    getSignedInContent(),
    BODY_SIGNED_IN_EMPTY_MESSAGE_TEXT,
  );
}

/** Plays signed-in empty-codes icon pop and message typing animation. */
export async function bodyAnimateForSignedInContent() {
  await bodyContentAnimate(
    getSignedInContent(),
    BODY_SIGNED_IN_EMPTY_MESSAGE_TEXT,
    SIGNED_IN_CONTENT_OPTIONS,
  );
}

/** Shows signed-in empty-codes icon and message immediately without animation. */
export function bodyAnimateForSignedInStatic() {
  bodyContentStatic(
    getSignedInContent(),
    BODY_SIGNED_IN_EMPTY_MESSAGE_TEXT,
    SIGNED_IN_CONTENT_OPTIONS,
  );
}
