import { userMenuDomGet } from "../user-menu.dom.js";
import { userMenuRenderSwitchAuth } from "../user-menu.render.js";

import { USER_MENU_AUTH_SIGN_UP_CLASS, USER_MENU_AUTH_VIEW_SIGN_IN, USER_MENU_AUTH_VIEW_SIGN_UP } from "../../../../const/const.user-menu.js";

/** Switches the user-menu auth view between sign-in and sign-up instantly. */
function _userMenuSwitchAuth(authView) {
  authView = authView === USER_MENU_AUTH_VIEW_SIGN_UP ? USER_MENU_AUTH_VIEW_SIGN_UP : USER_MENU_AUTH_VIEW_SIGN_IN;
  const isSignUp = authView === USER_MENU_AUTH_VIEW_SIGN_UP;
  const dom = userMenuDomGet();
  if (dom.authTrack?.classList.contains(USER_MENU_AUTH_SIGN_UP_CLASS) === isSignUp) {
    return;
  }
  userMenuRenderSwitchAuth(authView);
}

export { _userMenuSwitchAuth as userMenuSwitchAuth };
