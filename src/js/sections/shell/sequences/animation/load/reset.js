import { headerAnimationReset } from "../../../header/header-index.js";

import { INTRO_ACTIVE_CLASS } from "../../sequences-const.js";
import { INTRO_ROOT_SELECTOR } from "../../sequences-const.js";

function loadAnimationReset() {
  document.querySelector(INTRO_ROOT_SELECTOR)?.classList.add(INTRO_ACTIVE_CLASS);
  headerAnimationReset();
}

export { loadAnimationReset };
