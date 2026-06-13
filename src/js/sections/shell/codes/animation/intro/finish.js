import { CODES_CARD_INTRO_PENDING_CLASS } from "../../../../../const/const.codes.js";
import { CODES_ROOT_SELECTOR } from "../../../../../const/const.codes.js";

/** Clears card intro pending class after load animation completes. */
function codesAnimationIntroFinish() {
  document.querySelector(CODES_ROOT_SELECTOR)?.classList.remove(CODES_CARD_INTRO_PENDING_CLASS);
}

export { codesAnimationIntroFinish };
