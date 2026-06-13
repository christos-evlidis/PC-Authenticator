import { appActionThemeApply } from "../../../../app/app.actions.js";
import { appActionGetTheme } from "../../../../app/app.actions.js";

import { userMenuRenderSwitchTheme } from "../user-menu.render.js";
import { userMenuRenderSwitchAuth } from "../user-menu.render.js";

import { userMenuAnimationSwitchTheme } from "../user-menu.animation.js";
import { userMenuAnimationSwitchAuth } from "../user-menu.animation.js";

import { userMenuDomGet } from "../user-menu.dom.js";

import { USER_MENU_AUTH_SIGN_UP_CLASS } from "../../../../const/const.user-menu.js";
import { USER_MENU_AUTH_VIEW_SIGN_IN } from "../../../../const/const.user-menu.js";
import { USER_MENU_AUTH_VIEW_SIGN_UP } from "../../../../const/const.user-menu.js";


// Switches the authentication view between sign-in and sign-up.
function userMenuAuthSwitch(authView) {
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
function userMenuThemeSwitch(themeView) {
  const currentTheme = appActionGetTheme();

  if (currentTheme === themeView) {
    return;
  }

  appActionThemeApply(themeView);

  userMenuRenderSwitchTheme(themeView);
  
  void userMenuAnimationSwitchTheme(themeView);
}


export { userMenuAuthSwitch };
export { userMenuThemeSwitch };
