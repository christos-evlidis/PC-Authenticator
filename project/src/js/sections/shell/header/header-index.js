import { HEADER_HIDDEN_CLASS } from "../../../const/const.header.js";
import { HEADER_SIGNED_IN_VIEW_SELECTOR } from "../../../const/const.header.js";
import { HEADER_SIGNED_OUT_VIEW_SELECTOR } from "../../../const/const.header.js";

function _headerInit(isSignedIn) {
  const signedOutView = document.querySelector(HEADER_SIGNED_OUT_VIEW_SELECTOR);
  const signedInView = document.querySelector(HEADER_SIGNED_IN_VIEW_SELECTOR);

  signedOutView?.classList.toggle(HEADER_HIDDEN_CLASS, isSignedIn);
  signedInView?.classList.toggle(HEADER_HIDDEN_CLASS, !isSignedIn);
}

function _headerApplySignedIn(options = {}) {
  _headerInit(true);
}

function _headerApplySignedOut(options = {}) {
  _headerInit(false);
}

export {
  _headerInit as headerInit,
  _headerApplySignedIn as headerApplySignedIn,
  _headerApplySignedOut as headerApplySignedOut,
};

export { headerActionIconsDisable } from "./action/icons/disable.js";
export { headerActionIconsEnable } from "./action/icons/enable.js";
