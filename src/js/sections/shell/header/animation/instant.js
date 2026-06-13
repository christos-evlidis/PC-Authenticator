import { HEADER_ANIMATION_PENDING_CLASS } from "../../../../const/const.header.js";
import { HEADER_BUTTON_SELECTOR } from "../../../../const/const.header.js";
import { HEADER_CONTENT_PENDING_CLASS } from "../../../../const/const.header.js";
import { HEADER_FADE_IN_CLASS } from "../../../../const/const.header.js";
import { HEADER_HIDDEN_CLASS } from "../../../../const/const.header.js";
import { HEADER_ICON_POP_PENDING_CLASS } from "../../../../const/const.header.js";
import { HEADER_ICON_POP_REVEALED_CLASS } from "../../../../const/const.header.js";
import { HEADER_ROOT_SELECTOR } from "../../../../const/const.header.js";
import { HEADER_TITLE_DISPLAY_SELECTOR } from "../../../../const/const.header.js";
import { HEADER_TITLE_SELECTOR } from "../../../../const/const.header.js";
import { HEADER_TITLE_TEXT } from "../../../../const/const.header.js";
import { HEADER_TITLE_TYPING_CLASS } from "../../../../const/const.header.js";
import { HEADER_VIEW_SELECTOR } from "../../../../const/const.header.js";

function headerAnimationInstant() {
  const header = document.querySelector(HEADER_ROOT_SELECTOR);
  const title = document.querySelector(HEADER_TITLE_SELECTOR);
  const display = document.querySelector(HEADER_TITLE_DISPLAY_SELECTOR);

  if (!header) {
    return;
  }

  header.classList.remove(
    HEADER_HIDDEN_CLASS,
    HEADER_ANIMATION_PENDING_CLASS,
    HEADER_CONTENT_PENDING_CLASS,
    HEADER_FADE_IN_CLASS,
  );

  if (display) {
    display.classList.remove(HEADER_TITLE_TYPING_CLASS);
    display.textContent = title?.dataset.fullTitle || HEADER_TITLE_TEXT;
  }

  [...document.querySelectorAll(HEADER_VIEW_SELECTOR)]
    .filter((view) => !view.classList.contains(HEADER_HIDDEN_CLASS))
    .flatMap((view) => [...view.querySelectorAll(HEADER_BUTTON_SELECTOR)])
    .forEach((button) => {
      button.classList.remove(HEADER_ICON_POP_PENDING_CLASS);
      button.classList.add(HEADER_ICON_POP_REVEALED_CLASS);
    });
}

export { headerAnimationInstant };
