import { appThemeApply, THEME_DARK_KEY, THEME_LIGHT_KEY } from "../../../../app/app.actions.js";

import { userMenuRenderSwitchTheme } from "../user-menu.render.js";
import { userMenuRenderSwitchAuth } from "../user-menu.render.js";

import { userMenuAnimationSwitchTheme } from "../user-menu.animation.js";
import { userMenuAnimationSwitchAuth } from "../user-menu.animation.js";

import { userMenuDomGet } from "../user-menu.dom.js";

import { USER_MENU_AUTH_SIGN_UP_CLASS } from "../../../../const/const.user-menu.js";
import { USER_MENU_AUTH_VIEW_SIGN_IN } from "../../../../const/const.user-menu.js";
import { USER_MENU_AUTH_VIEW_SIGN_UP } from "../../../../const/const.user-menu.js";
import { USER_MENU_THEME_VIEW_DARK } from "../../../../const/const.user-menu.js";


// Toggles the auth view... (skipped/omitted for context alignment, let's keep it exact)
// Switches the authentication view between sign-in and sign-up.
function userMenuSwitchAuth(authView) {
  authView = authView === USER_MENU_AUTH_VIEW_SIGN_UP ? USER_MENU_AUTH_VIEW_SIGN_UP : USER_MENU_AUTH_VIEW_SIGN_IN;
  const isSignUp = authView === USER_MENU_AUTH_VIEW_SIGN_UP;
  const dom = userMenuDomGet();
  if (dom.authTrack?.classList.contains(USER_MENU_AUTH_SIGN_UP_CLASS) === isSignUp) {
    return;
  }
  userMenuRenderSwitchAuth(authView);
  void userMenuAnimationSwitchAuth(authView);
}

// Switches the application theme between light and dark.
function userMenuSwitchTheme(themeView) {
  themeView = themeView === THEME_DARK_KEY ? THEME_DARK_KEY : THEME_LIGHT_KEY;
  const isDark = themeView === THEME_DARK_KEY;
  const dom = userMenuDomGet();
  if (dom.themeTrack?.classList.contains(USER_MENU_THEME_VIEW_DARK) === isDark) {
    return;
  }
  appThemeApply(themeView);
  userMenuRenderSwitchTheme(themeView);
  void userMenuAnimationSwitchTheme(themeView);
}


export { userMenuSwitchAuth };
export { userMenuSwitchTheme };
