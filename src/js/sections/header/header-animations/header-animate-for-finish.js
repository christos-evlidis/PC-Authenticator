import { HEADER_ANIMATE_FOR_FADE_IN_CLASS } from "../header-constants.js";
import { HEADER_ANIMATE_FOR_FADE_IN_HIDDEN_CLASS } from "../header-constants.js";
import { HEADER_ROOT_SELECTOR } from "../header-constants.js";

/** Removes fade-in classes after the finish phase. */
export function headerAnimateForFinish() {
  const header = document.querySelector(HEADER_ROOT_SELECTOR);

  header?.classList.remove(
    HEADER_ANIMATE_FOR_FADE_IN_HIDDEN_CLASS,
    HEADER_ANIMATE_FOR_FADE_IN_CLASS,
  );
}
