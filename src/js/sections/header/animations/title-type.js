import { animCssMsGet } from "../../../utils/utility-animation.js";
import { animDelay } from "../../../utils/utility-animation.js";

import { HEADER_ROOT_SELECTOR } from "../constants.js";
import { HEADER_TITLE_DISPLAY_SELECTOR } from "../constants.js";
import { HEADER_TITLE_SELECTOR } from "../constants.js";
import { HEADER_TITLE_TEXT } from "../constants.js";
import { HEADER_TITLE_TYPING_CLASS } from "../constants.js";
import { HEADER_VAR_TITLE_TYPE_MS } from "../constants.js";

/** Types the header title text over the configured duration. */
async function headerAnimationTitleType() {
  const header = document.querySelector(HEADER_ROOT_SELECTOR);
  const title = document.querySelector(HEADER_TITLE_SELECTOR);
  const display = document.querySelector(HEADER_TITLE_DISPLAY_SELECTOR);

  if (!header || !title || !display) {
    return;
  }

  const fullText = title.dataset.fullTitle || HEADER_TITLE_TEXT;
  const typeMs = animCssMsGet(header, HEADER_VAR_TITLE_TYPE_MS);
  const charCount = fullText.length;
  const stepMs = charCount > 0 ? typeMs / charCount : typeMs;

  display.textContent = "";
  display.classList.add(HEADER_TITLE_TYPING_CLASS);

  for (let index = 0; index < charCount; index += 1) {
    display.textContent = fullText.slice(0, index + 1);
    await animDelay(stepMs);
  }

  display.classList.remove(HEADER_TITLE_TYPING_CLASS);
}

export { headerAnimationTitleType };
