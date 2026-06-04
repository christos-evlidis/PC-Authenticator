import { cssMs } from "../../../utils/utility-animation.js";
import { delay } from "../../../utils/utility-animation.js";
import { waitForAnimationEnd } from "../../../utils/utility-animation.js";
import { waitForNextFrame } from "../../../utils/utility-animation.js";
import { HEADER_ACTIVE_CLASS } from "../header-constants.js";
import { HEADER_ANIMATION_TIMEOUT_BUFFER_MS } from "../header-constants.js";
import { HEADER_BUTTON_SELECTOR } from "../header-constants.js";
import { HEADER_HIDDEN_CLASS } from "../header-constants.js";
import { HEADER_INTRO_FADE_IN_CLASS } from "../header-constants.js";
import { HEADER_PENDING_CLASS } from "../header-constants.js";
import { HEADER_POPPING_CLASS } from "../header-constants.js";
import { HEADER_ROOT_SELECTOR } from "../header-constants.js";
import { HEADER_RUNNING_CLASS } from "../header-constants.js";
import { HEADER_SIGNED_IN_VIEW_SELECTOR } from "../header-constants.js";
import { HEADER_SIGNED_OUT_VIEW_SELECTOR } from "../header-constants.js";
import { HEADER_TITLE_SELECTOR } from "../header-constants.js";
import { HEADER_TITLE_TEXT } from "../header-constants.js";
import { HEADER_TYPING_CLASS } from "../header-constants.js";
import { HEADER_VAR_BTN_POP_MS } from "../header-constants.js";
import { HEADER_VAR_BTN_POP_STAGGER_MS } from "../header-constants.js";
import { HEADER_VAR_TITLE_TYPE_MS } from "../header-constants.js";

/** Plays title typing and button pop animations. */
export async function headerAnimateForContent() {
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
  const titleTypeMs = cssMs(header, HEADER_VAR_TITLE_TYPE_MS);
  const btnPopMs = cssMs(header, HEADER_VAR_BTN_POP_MS);
  const btnPopStaggerMs = cssMs(header, HEADER_VAR_BTN_POP_STAGGER_MS);

  if (title) {
    title.dataset.fullTitle = HEADER_TITLE_TEXT;
    title.textContent = "";
    title.classList.add(HEADER_TYPING_CLASS, HEADER_RUNNING_CLASS);

    const charCount = HEADER_TITLE_TEXT.length;
    const stepMs = charCount > 0 ? titleTypeMs / charCount : 0;

    for (let index = 1; index <= charCount; index += 1) {
      title.textContent = HEADER_TITLE_TEXT.slice(0, index);

      if (index < charCount) {
        await delay(stepMs);
      }
    }

    title.classList.remove(HEADER_TYPING_CLASS, HEADER_RUNNING_CLASS);
    title.textContent = HEADER_TITLE_TEXT;
  }

  if (buttons.length > 0) {
    await waitForNextFrame();

    buttons.forEach((button) => {
      button.classList.remove(HEADER_PENDING_CLASS);
      button.classList.add(HEADER_POPPING_CLASS);
    });

    const totalPopMs =
      (buttons.length - 1) * btnPopStaggerMs +
      btnPopMs +
      HEADER_ANIMATION_TIMEOUT_BUFFER_MS;

    await waitForAnimationEnd(
      buttons[buttons.length - 1],
      "headerBtnPopFade",
      totalPopMs,
    );

    buttons.forEach((button) => {
      button.classList.remove(HEADER_POPPING_CLASS);
      button.classList.add(HEADER_ACTIVE_CLASS);
    });
  }

  header?.classList.remove(HEADER_PENDING_CLASS, HEADER_INTRO_FADE_IN_CLASS);
  header?.classList.add(HEADER_ACTIVE_CLASS);
}
