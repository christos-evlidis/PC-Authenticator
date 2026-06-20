import { BODY_ACTIVE_CLASS } from "../../../const/const.body.js";
import { BODY_CONTENT_HIDDEN_CLASS } from "../../../const/const.body.js";
import { BODY_CONTENT_SIGNED_IN_SELECTOR } from "../../../const/const.body.js";
import { BODY_HIDDEN_CLASS } from "../../../const/const.body.js";
import { BODY_ROOT_SELECTOR } from "../../../const/const.body.js";
import { BODY_SIGNED_IN_VIEW_SELECTOR } from "../../../const/const.body.js";
import { BODY_SIGNED_OUT_VIEW_SELECTOR } from "../../../const/const.body.js";
import { CODES_HIDDEN_CLASS } from "../../../const/const.codes.js";
import { CODES_ROOT_SELECTOR } from "../../../const/const.codes.js";
import { bodyAnimationFinish } from "./animation/finish.js";

function _bodyInit(isSignedIn, options = {}) {
  const signedOutView = document.querySelector(BODY_SIGNED_OUT_VIEW_SELECTOR);
  const signedInView = document.querySelector(BODY_SIGNED_IN_VIEW_SELECTOR);
  signedOutView?.classList.toggle(BODY_HIDDEN_CLASS, isSignedIn);
  signedInView?.classList.toggle(BODY_HIDDEN_CLASS, !isSignedIn);
  if (isSignedIn) {
    const showCodes = options.stateCodes === true;
    document
      .querySelector(BODY_CONTENT_SIGNED_IN_SELECTOR)
      ?.classList.toggle(BODY_CONTENT_HIDDEN_CLASS, showCodes);
    document.querySelector(CODES_ROOT_SELECTOR)?.classList.toggle(CODES_HIDDEN_CLASS, !showCodes);
    document.querySelector(BODY_ROOT_SELECTOR)?.classList.remove(BODY_ACTIVE_CLASS);
  }
}

function _bodyApplySignedIn(options = {}) {
  _bodyInit(true, { stateCodes: options.stateCodes });
}

function _bodyApplySignedOut() {
  _bodyInit(false, { stateCodes: false });
}

export {
  _bodyInit as bodyInit,
  _bodyApplySignedIn as bodyApplySignedIn,
  _bodyApplySignedOut as bodyApplySignedOut,
};

export { bodyAnimationFinish } from "./animation/finish.js";
export { bodyAnimationInstant } from "./animation/instant.js";
export { bodyAnimationReset } from "./animation/reset.js";
export { bodyAnimationStart } from "./animation/start.js";

// Functions exported from this section:
// - bodyInit
// - bodyApplySignedIn
// - bodyApplySignedOut
// - bodyAnimationFinish
// - bodyAnimationInstant
// - bodyAnimationReset
// - bodyAnimationStart

// Functions used by other parts of the codebase:
// - bodyInit (used in project/src/js/sections/shell/codes/codes-index.js, project/src/js/sections/shell/codes/action/add.js)
// - bodyApplySignedIn (used in project/src/js/app/app.shell.js)
// - bodyApplySignedOut (used in project/src/js/app/app.shell.js)
// - bodyAnimationReset (used in project/src/js/services/sequences/animation/load/start.js, project/src/js/services/sequences/animation/load/instant.js, project/src/js/sections/shell/codes/animation/delete/start.js)
// - bodyAnimationStart (used in project/src/js/services/sequences/animation/load/start.js, project/src/js/sections/shell/codes/animation/delete/start.js)
// - bodyAnimationInstant (used in project/src/js/services/sequences/animation/load/instant.js)
// - bodyAnimationFinish (used in project/src/js/sections/shell/codes/animation/delete/start.js)
