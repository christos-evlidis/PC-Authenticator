import { BODY_ANIMATE_FOR_EXTENSION_FRAME_CLASS } from "../constants.js";
import { BODY_ANIMATE_FOR_HEADER_CLASS } from "../constants.js";
import { BODY_ANIMATE_FOR_START_CLASS } from "../constants.js";
import { BODY_LOGO_SELECTOR } from "../constants.js";
import { BODY_ROOT_SELECTOR } from "../constants.js";
import { EXTENSION_FRAME_SELECTOR } from "../constants.js";

/** Clears bootstrap animate-for classes and removes the logo overlay after the finish phase. */
export function bodyAnimateForFinish() {
  const frame = document.querySelector(EXTENSION_FRAME_SELECTOR);
  const body = document.querySelector(BODY_ROOT_SELECTOR);
  const logo = document.querySelector(BODY_LOGO_SELECTOR);

  frame?.classList.remove(BODY_ANIMATE_FOR_START_CLASS);
  body?.classList.remove(
    BODY_ANIMATE_FOR_START_CLASS,
    BODY_ANIMATE_FOR_EXTENSION_FRAME_CLASS,
    BODY_ANIMATE_FOR_HEADER_CLASS,
  );
  logo?.remove();
}
