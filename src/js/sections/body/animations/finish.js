import { BODY_ANIMATE_FOR_EXTENSION_FRAME_CLASS } from "../constants.js";
import { BODY_ANIMATE_FOR_HEADER_CLASS } from "../constants.js";
import { BODY_ANIMATE_FOR_START_CLASS } from "../constants.js";
import { BODY_ROOT_SELECTOR } from "../constants.js";
import { BODY_SPLASH_SELECTOR } from "../constants.js";
import { EXTENSION_FRAME_SELECTOR } from "../constants.js";

/** Removes animate-for classes and splash after the finish phase. */
export function bodyAnimateForFinish() {
  const frame = document.querySelector(EXTENSION_FRAME_SELECTOR);
  const body = document.querySelector(BODY_ROOT_SELECTOR);
  const splash = document.querySelector(BODY_SPLASH_SELECTOR);

  frame?.classList.remove(BODY_ANIMATE_FOR_START_CLASS);
  body?.classList.remove(
    BODY_ANIMATE_FOR_START_CLASS,
    BODY_ANIMATE_FOR_EXTENSION_FRAME_CLASS,
    BODY_ANIMATE_FOR_HEADER_CLASS,
  );
  splash?.remove();
}
