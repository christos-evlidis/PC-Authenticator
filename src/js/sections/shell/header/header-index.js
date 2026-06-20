import { HEADER_HIDDEN_CLASS } from "../../../const/const.header.js";
import { HEADER_SIGNED_IN_VIEW_SELECTOR } from "../../../const/const.header.js";
import { HEADER_SIGNED_OUT_VIEW_SELECTOR } from "../../../const/const.header.js";
import { headerAnimationInstant } from "./animation/instant.js";

function _headerInit(isSignedIn) {
  const signedOutView = document.querySelector(HEADER_SIGNED_OUT_VIEW_SELECTOR);
  const signedInView = document.querySelector(HEADER_SIGNED_IN_VIEW_SELECTOR);

  signedOutView?.classList.toggle(HEADER_HIDDEN_CLASS, isSignedIn);
  signedInView?.classList.toggle(HEADER_HIDDEN_CLASS, !isSignedIn);
}

function _headerApplySignedIn(options = {}) {
  _headerInit(true);

  if (options.instant) {
    headerAnimationInstant();
  }
}

function _headerApplySignedOut(options = {}) {
  _headerInit(false);

  if (options.instant) {
    headerAnimationInstant();
  }
}

export {
  _headerInit as headerInit,
  _headerApplySignedIn as headerApplySignedIn,
  _headerApplySignedOut as headerApplySignedOut,
};

export { headerActionIconsDisable } from "./action/icons/disable.js";
export { headerActionIconsEnable } from "./action/icons/enable.js";
export { headerAnimationFinish } from "./animation/finish.js";
export { headerAnimationInstant } from "./animation/instant.js";
export { headerAnimationReset } from "./animation/reset.js";
export { headerAnimationStart } from "./animation/start.js";

// Functions exported from this section:
// - headerInit
// - headerApplySignedIn
// - headerApplySignedOut
// - headerActionIconsDisable
// - headerActionIconsEnable
// - headerAnimationFinish
// - headerAnimationInstant
// - headerAnimationReset
// - headerAnimationStart

// Functions used by other parts of the codebase:
// - headerApplySignedIn (used in project/src/js/app/app.shell.js)
// - headerApplySignedOut (used in project/src/js/app/app.shell.js)
// - headerActionIconsDisable (used in project/src/js/sections/shell/codes/action/delete.js, project/src/js/sections/shell/codes/action/edit.js)
// - headerActionIconsEnable (used in project/src/js/sections/shell/codes/action/delete.js, project/src/js/sections/shell/codes/action/edit.js)
// - headerAnimationReset (used in project/src/js/services/sequences/animation/load/reset.js)
// - headerAnimationStart (used in project/src/js/services/sequences/animation/load/start.js)
// - headerAnimationInstant (used in project/src/js/services/sequences/animation/load/instant.js)
// - headerAnimationFinish (used in project/src/js/services/sequences/animation/load/start.js)
