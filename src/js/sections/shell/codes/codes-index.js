import { codesActionWheel } from "./action/wheel.js";
import { codesLoadClear } from "./load/sync.js";
import { codesUtilTimerPreferenceLoad } from "./util/timer-preference.js";

import { CODES_HIDDEN_CLASS } from "./codes-const.js";
import { CODES_ROOT_SELECTOR } from "./codes-const.js";

/** Registers codes section listeners and loads timer preference. */
function codesInit() {
  codesActionWheel();
  void codesUtilTimerPreferenceLoad();
}

/** Shows or hides the codes section on sign-out and clears cards. */
function codesApply(isSignedIn) {
  if (!isSignedIn) {
    document.querySelector(CODES_ROOT_SELECTOR)?.classList.add(CODES_HIDDEN_CLASS);
    codesLoadClear();
  }
}

export { codesApply };
export { codesInit };
export { codesActionAdd } from "./action/add.js";
export { codesCardRender } from "./load/render.js";
export { codesLoadStart } from "./load/start.js";
export { codesLoadClear } from "./load/sync.js";
export { codesLoadRestore } from "./load/sync.js";
