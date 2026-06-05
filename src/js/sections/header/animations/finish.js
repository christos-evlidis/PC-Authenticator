import { HEADER_ANIMATION_PENDING_CLASS } from "../constants.js";
import { HEADER_CONTENT_PENDING_CLASS } from "../constants.js";
import { HEADER_FADE_IN_CLASS } from "../constants.js";
import { HEADER_ICON_POP_PENDING_CLASS } from "../constants.js";
import { HEADER_ICON_POP_REVEALED_CLASS } from "../constants.js";
import { HEADER_ROOT_SELECTOR } from "../constants.js";
import { HEADER_TITLE_DISPLAY_SELECTOR } from "../constants.js";
import { HEADER_TITLE_SELECTOR } from "../constants.js";
import { HEADER_TITLE_TEXT } from "../constants.js";
import { HEADER_TITLE_TYPING_CLASS } from "../constants.js";

/** Clears one-shot header animation classes after the intro sequence. */
function headerAnimationFinish() {
  const header = document.querySelector(HEADER_ROOT_SELECTOR);
  const title = document.querySelector(HEADER_TITLE_SELECTOR);
  const display = document.querySelector(HEADER_TITLE_DISPLAY_SELECTOR);

  if (!header) {
    return;
  }

  header.classList.remove(
    HEADER_ANIMATION_PENDING_CLASS,
    HEADER_CONTENT_PENDING_CLASS,
    HEADER_FADE_IN_CLASS,
  );

  if (display) {
    display.classList.remove(HEADER_TITLE_TYPING_CLASS);
    display.textContent = title?.dataset.fullTitle || HEADER_TITLE_TEXT;
  }

  header.querySelectorAll(`.${HEADER_ICON_POP_PENDING_CLASS}`).forEach((button) => {
    button.classList.remove(HEADER_ICON_POP_PENDING_CLASS);
    button.classList.add(HEADER_ICON_POP_REVEALED_CLASS);
  });
}

export { headerAnimationFinish };
