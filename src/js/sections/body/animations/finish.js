import { BODY_INTRO_FULLBLEED_CLASS } from "../constants.js";
import { BODY_INTRO_INSET_CLASS } from "../constants.js";
import { BODY_INTRO_SLOT_CLASS } from "../constants.js";
import { BODY_ROOT_SELECTOR } from "../constants.js";
import { BODY_SPLASH_SELECTOR } from "../constants.js";
import { EXTENSION_FRAME_SELECTOR } from "../constants.js";
import { FRAME_INTRO_CLASS } from "../constants.js";

/** Removes frame intro classes and splash after intro completes. */
export function bodyAnimateForFinish() {
  const frame = document.querySelector(EXTENSION_FRAME_SELECTOR);
  const body = document.querySelector(BODY_ROOT_SELECTOR);
  const splash = document.querySelector(BODY_SPLASH_SELECTOR);

  frame?.classList.remove(FRAME_INTRO_CLASS);
  body?.classList.remove(
    BODY_INTRO_FULLBLEED_CLASS,
    BODY_INTRO_INSET_CLASS,
    BODY_INTRO_SLOT_CLASS,
  );
  splash?.remove();
}
