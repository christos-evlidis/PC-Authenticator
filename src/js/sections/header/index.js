import { animCssMsGet } from "../../utils/utility-animation.js";
import { animDelay } from "../../utils/utility-animation.js";
import { headerAnimationFadeIn } from "./animations/fade-in.js";
import { headerAnimationFadeOutContents } from "./animations/fade-out.js";
import { headerAnimationFadeRestore } from "./animations/fade-out.js";
import { headerAnimationFinish } from "./animations/finish.js";
import { headerAnimationIconPop } from "./animations/icon-pop.js";
import { headerAnimationTitleType } from "./animations/title-type.js";

import { HEADER_ANIMATION_PENDING_CLASS } from "./constants.js";
import { HEADER_CONTENT_PENDING_CLASS } from "./constants.js";
import { HEADER_VAR_ANIMATION_TIMEOUT_BUFFER_MS } from "./constants.js";
import { HEADER_BUTTON_SELECTOR } from "./constants.js";
import { HEADER_HIDDEN_CLASS } from "./constants.js";
import { HEADER_ICON_POP_PENDING_CLASS } from "./constants.js";
import { HEADER_ICON_POP_REVEALED_CLASS } from "./constants.js";
import { HEADER_ROOT_SELECTOR } from "./constants.js";
import { HEADER_SIGNED_IN_VIEW_SELECTOR } from "./constants.js";
import { HEADER_SIGNED_OUT_VIEW_SELECTOR } from "./constants.js";
import { HEADER_TITLE_DISPLAY_SELECTOR } from "./constants.js";
import { HEADER_TITLE_SELECTOR } from "./constants.js";
import { HEADER_VIEW_SELECTOR } from "./constants.js";

/** Toggles signed-in/out header views for the current auth state. */
function headerApply(isSignedIn) {
  const signedOutView = document.querySelector(HEADER_SIGNED_OUT_VIEW_SELECTOR);
  const signedInView = document.querySelector(HEADER_SIGNED_IN_VIEW_SELECTOR);

  signedOutView?.classList.toggle(HEADER_HIDDEN_CLASS, isSignedIn);
  signedInView?.classList.toggle(HEADER_HIDDEN_CLASS, !isSignedIn);
}

/** Hides header title and icons before an intro reveal sequence. */
async function headerAnimationPrepare(mode) {
  const header = document.querySelector(HEADER_ROOT_SELECTOR);
  const title = document.querySelector(HEADER_TITLE_SELECTOR);
  const display = document.querySelector(HEADER_TITLE_DISPLAY_SELECTOR);

  if (!header) {
    return;
  }

  if (mode === "sign-in-fade") {
    header.classList.remove(HEADER_ANIMATION_PENDING_CLASS);
    await headerAnimationFadeOutContents();
    return;
  }

  if (mode === "sign-in") {
    header.classList.remove(HEADER_ANIMATION_PENDING_CLASS);
  } else {
    header.classList.add(HEADER_ANIMATION_PENDING_CLASS);
    header.classList.remove(HEADER_CONTENT_PENDING_CLASS);
  }

  [...document.querySelectorAll(HEADER_VIEW_SELECTOR)]
    .filter((view) => !view.classList.contains(HEADER_HIDDEN_CLASS))
    .flatMap((view) => [...view.querySelectorAll(HEADER_BUTTON_SELECTOR)])
    .forEach((button) => {
      button.classList.add(HEADER_ICON_POP_PENDING_CLASS);
      button.classList.remove(HEADER_ICON_POP_REVEALED_CLASS);
    });

  if (display) {
    display.textContent = "";
  } else if (title) {
    title.textContent = "";
  }
}

/** Runs the header reveal sequence after an intro shrink phase. */
async function headerAnimationRun(mode) {
  const header = document.querySelector(HEADER_ROOT_SELECTOR);

  if (!header) {
    return;
  }

  if (mode === "sign-in") {
    if (!header.classList.contains(HEADER_CONTENT_PENDING_CLASS)) {
      return;
    }

    try {
      await animDelay(animCssMsGet(header, HEADER_VAR_ANIMATION_TIMEOUT_BUFFER_MS));
      header.classList.remove(HEADER_CONTENT_PENDING_CLASS);
      await headerAnimationTitleType();
      await headerAnimationIconPop();
      headerAnimationFinish();
    } catch {
      headerAnimationFinish();
    }

    return;
  }

  if (!header.classList.contains(HEADER_ANIMATION_PENDING_CLASS)) {
    return;
  }

  try {
    await animDelay(animCssMsGet(header, HEADER_VAR_ANIMATION_TIMEOUT_BUFFER_MS));
    await headerAnimationFadeIn();
    await headerAnimationTitleType();
    await headerAnimationIconPop();
    headerAnimationFinish();
  } catch {
    headerAnimationFinish();
  }
}

export { headerIconsDisable } from "./actions/icons.js";
export { headerIconsEnable } from "./actions/icons.js";
export { headerAnimationFinish } from "./animations/finish.js";
export { headerAnimationFadeRestore } from "./animations/fade-out.js";
export { headerApply };
export { headerAnimationPrepare };
export { headerAnimationRun };
