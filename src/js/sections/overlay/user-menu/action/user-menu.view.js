import { appThemeApply } from "../../../../app/app.actions.js";

import { userMenuAnimationSwitchAuth, userMenuAnimationSwitchTheme } from "../user-menu.animation.js";
import { userMenuDomGet } from "../user-menu.dom.js";
import { userMenuRenderSwitchAuth, userMenuRenderSwitchTheme } from "../user-menu.render.js";

import { THEME_DARK_KEY, THEME_LIGHT_KEY } from "../../../../const/const.theme.js";
import { USER_MENU_AUTH_SIGN_UP_CLASS, USER_MENU_AUTH_VIEW_SIGN_IN, USER_MENU_AUTH_VIEW_SIGN_UP, USER_MENU_THEME_VIEW_DARK } from "../../../../const/const.user-menu.js";

/** Switches the user-menu auth view between sign-in and sign-up. */
function userMenuSwitchAuth(authView) {
  authView = authView === USER_MENU_AUTH_VIEW_SIGN_UP ? USER_MENU_AUTH_VIEW_SIGN_UP : USER_MENU_AUTH_VIEW_SIGN_IN; // Normalize the requested auth view to sign-in or sign-up.
  const isSignUp = authView === USER_MENU_AUTH_VIEW_SIGN_UP; // Track whether the sign-up view should be active.
  const dom = userMenuDomGet(); // Read the current user-menu DOM references.
  if (dom.authTrack?.classList.contains(USER_MENU_AUTH_SIGN_UP_CLASS) === isSignUp) { // Stop when the auth track already matches the requested view.
    return; // Exit without re-rendering or replaying the thumb animation.
  }
  userMenuRenderSwitchAuth(authView); // Update auth buttons, views, and track classes for the selected auth tab.
  void userMenuAnimationSwitchAuth(); // Animate the auth thumb to the selected sign-in or sign-up position.
}

/** Switches the application theme between light and dark. */
function userMenuSwitchTheme(themeView) {
  themeView = themeView === THEME_DARK_KEY ? THEME_DARK_KEY : THEME_LIGHT_KEY; // Normalize the requested theme to light or dark.
  const isDark = themeView === THEME_DARK_KEY; // Track whether dark theme should be active.
  const dom = userMenuDomGet(); // Read the current user-menu DOM references.
  if (dom.themeTrack?.classList.contains(USER_MENU_THEME_VIEW_DARK) === isDark) { // Stop when the theme track already matches the requested theme.
    return; // Exit without re-applying or replaying the thumb animation.
  }
  appThemeApply(themeView); // Apply the selected theme to the extension chrome and storage.
  userMenuRenderSwitchTheme(themeView); // Update theme buttons and track classes in the user menu.
  void userMenuAnimationSwitchTheme(); // Animate the theme thumb to the selected light or dark position.
}

export { userMenuSwitchAuth, userMenuSwitchTheme };
