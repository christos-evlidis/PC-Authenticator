export { headerIconsDisable } from "./actions/icons.js";
export { headerIconsEnable } from "./actions/icons.js";
export { headerAnimationFinish } from "./animations/finish.js";

import { headerAnimationFadeIn } from "./animations/fade-in.js";
import { headerAnimationFinish } from "./animations/finish.js";
import { headerAnimationIconPop } from "./animations/icon-pop.js";
import { headerAnimationTitleType } from "./animations/title-type.js";
import { HEADER_ANIMATION_PENDING_CLASS } from "./constants.js";
import { HEADER_BUTTON_SELECTOR } from "./constants.js";
import { HEADER_HIDDEN_CLASS } from "./constants.js";
import { HEADER_ICON_POP_PENDING_CLASS } from "./constants.js";
import { HEADER_ICON_POP_REVEALED_CLASS } from "./constants.js";
import { HEADER_ROOT_SELECTOR } from "./constants.js";
import { HEADER_SIGNED_IN_VIEW_SELECTOR } from "./constants.js";
import { HEADER_SIGNED_OUT_VIEW_SELECTOR } from "./constants.js";
import { HEADER_TITLE_DISPLAY_SELECTOR } from "./constants.js";
import { HEADER_TITLE_SELECTOR } from "./constants.js";
import { HEADER_TITLE_TEXT } from "./constants.js";
import { HEADER_VIEW_SELECTOR } from "./constants.js";

/** Toggles signed-in/out header views for the current auth state. */
export function headerApply(isSignedIn) {
  const signedOutView = document.querySelector(HEADER_SIGNED_OUT_VIEW_SELECTOR);
  const signedInView = document.querySelector(HEADER_SIGNED_IN_VIEW_SELECTOR);

  signedOutView?.classList.toggle(HEADER_HIDDEN_CLASS, isSignedIn);
  signedInView?.classList.toggle(HEADER_HIDDEN_CLASS, !isSignedIn);
}

/** Hides header title and icons before the load intro reveals the header. */
export function headerAnimationPrepare() {
  const header = document.querySelector(HEADER_ROOT_SELECTOR);
  const title = document.querySelector(HEADER_TITLE_SELECTOR);
  const display = document.querySelector(HEADER_TITLE_DISPLAY_SELECTOR);

  if (!header) {
    return;
  }

  header.classList.add(HEADER_ANIMATION_PENDING_CLASS);

  if (display) {
    display.textContent = "";
  } else if (title) {
    title.textContent = "";
  }

  [...document.querySelectorAll(HEADER_VIEW_SELECTOR)]
    .filter((view) => !view.classList.contains(HEADER_HIDDEN_CLASS))
    .flatMap((view) => [...view.querySelectorAll(HEADER_BUTTON_SELECTOR)])
    .forEach((button) => {
      button.classList.add(HEADER_ICON_POP_PENDING_CLASS);
      button.classList.remove(HEADER_ICON_POP_REVEALED_CLASS);
    });
}

/** Runs the one-time header reveal sequence after the intro header shrink. */
export async function headerAnimationRun() {
  const header = document.querySelector(HEADER_ROOT_SELECTOR);

  if (!header || !header.classList.contains(HEADER_ANIMATION_PENDING_CLASS)) {
    return;
  }

  try {
    await headerAnimationFadeIn();
    await headerAnimationTitleType();
    await headerAnimationIconPop();
    headerAnimationFinish();
  } catch {
    headerAnimationFinish();
  }
}
