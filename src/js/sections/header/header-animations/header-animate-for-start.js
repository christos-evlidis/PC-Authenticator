import { themeApplySplashLogo } from "../../../utils/utility-theme.js";
import { themeRead } from "../../../utils/utility-theme.js";
import { HEADER_ACTIVE_CLASS } from "../header-constants.js";
import { HEADER_BUTTON_SELECTOR } from "../header-constants.js";
import { HEADER_HIDDEN_CLASS } from "../header-constants.js";
import { HEADER_PENDING_CLASS } from "../header-constants.js";
import { HEADER_POPPING_CLASS } from "../header-constants.js";
import { HEADER_ROOT_SELECTOR } from "../header-constants.js";
import { HEADER_RUNNING_CLASS } from "../header-constants.js";
import { HEADER_SIGNED_IN_VIEW_SELECTOR } from "../header-constants.js";
import { HEADER_SIGNED_OUT_VIEW_SELECTOR } from "../header-constants.js";
import { HEADER_TITLE_SELECTOR } from "../header-constants.js";
import { HEADER_TITLE_TEXT } from "../header-constants.js";
import { HEADER_TYPING_CLASS } from "../header-constants.js";

/** Resets header chrome to the pre-start hidden state. */
export function headerAnimateForStart() {
  themeApplySplashLogo(themeRead());

  const header = document.querySelector(HEADER_ROOT_SELECTOR);
  const title = document.querySelector(HEADER_TITLE_SELECTOR);
  const activeView =
    header?.querySelector(
      `${HEADER_SIGNED_IN_VIEW_SELECTOR}:not(.${HEADER_HIDDEN_CLASS})`,
    ) ||
    header?.querySelector(
      `${HEADER_SIGNED_OUT_VIEW_SELECTOR}:not(.${HEADER_HIDDEN_CLASS})`,
    );
  const buttons = activeView
    ? [...activeView.querySelectorAll(HEADER_BUTTON_SELECTOR)]
    : [];

  header?.classList.remove(HEADER_ACTIVE_CLASS);
  header?.classList.add(HEADER_PENDING_CLASS);

  if (title) {
    title.dataset.fullTitle = HEADER_TITLE_TEXT;
    title.textContent = "";
    title.classList.remove(HEADER_RUNNING_CLASS, HEADER_TYPING_CLASS);
  }

  buttons.forEach((button) => {
    button.classList.remove(HEADER_RUNNING_CLASS, HEADER_ACTIVE_CLASS, HEADER_POPPING_CLASS);
    button.classList.add(HEADER_PENDING_CLASS);
  });
}
