import { headerAnimationReset } from "../../../../sections/shell/header/header-index.js";

import { INTRO_ACTIVE_CLASS, INTRO_ROOT_SELECTOR } from "../../../../const/const.sequences.js";

function loadAnimationReset() {
  document.querySelector(INTRO_ROOT_SELECTOR)?.classList.add(INTRO_ACTIVE_CLASS);
  headerAnimationReset();
}

export { loadAnimationReset };
