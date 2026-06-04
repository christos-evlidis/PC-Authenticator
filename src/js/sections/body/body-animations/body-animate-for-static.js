import { bodyContentStatic } from "./body-animate-content.js";
import { BODY_CONTENT_SELECTOR } from "../body-constants.js";
import { BODY_SIGNED_OUT_MESSAGE_TEXT } from "../body-constants.js";

/** Shows icon and message immediately without animation. */
export function bodyAnimateForStatic() {
  const content = document.querySelector(BODY_CONTENT_SELECTOR);

  bodyContentStatic(content, BODY_SIGNED_OUT_MESSAGE_TEXT);
}
