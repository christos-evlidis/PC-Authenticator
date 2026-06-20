import { userMenuDomSet } from "./user-menu.dom.js";
import { userMenuStateSet } from "./user-menu.state.js";

import { THEME_DARK_KEY, THEME_LIGHT_KEY } from "../../../const/const.theme.js";
import { USER_MENU_AUTH_VIEW_SIGN_IN, USER_MENU_AUTH_VIEW_SIGN_UP } from "../../../const/const.user-menu.js";

/** Renders the user menu in the signed-in state. */
function _userMenuRenderSignedIn(authKey) {
  userMenuStateSet({ stateAuth: true }); // Mark the user-menu state as signed in.
  userMenuDomSet({
    showBarAuth: false, // Hide the sign-in/sign-up tab bar.
    showBarTheme: true, // Show the light/dark theme tab bar.
    showViewSignedOut: false, // Hide the signed-out content block.
    showViewSignedIn: true, // Show the signed-in content block.
    accountFieldSignedIn: authKey ?? "", // Fill the signed-in account number field.
  });
}

/** Renders the user menu in the signed-out state. */
function _userMenuRenderSignedOut(authKey) {
  userMenuStateSet({ stateAuth: false }); // Mark the user-menu state as signed out.
  userMenuDomSet({
    showBarAuth: true, // Show the sign-in/sign-up tab bar.
    showBarTheme: false, // Hide the light/dark theme tab bar.
    showViewSignedOut: true, // Show the signed-out content block.
    showViewSignedIn: false, // Hide the signed-in content block.
    accountFieldSignedIn: "", // Clear the signed-in account number field.
    accountFieldSignedOut: authKey, // Seed the sign-in input with the provided account key when available.
  });
}

/** Updates the user-menu theme toggle UI for the selected theme. */
function _userMenuRenderSwitchTheme(themeView) {
  if (themeView !== THEME_DARK_KEY) { // Fall back to light theme for any non-dark value.
    themeView = THEME_LIGHT_KEY; // Normalize the theme key to light mode.
  }
  userMenuDomSet({ theme: themeView }); // Apply the active theme classes and button states.
}

/** Updates the user-menu auth tab UI for the selected auth view. */
function _userMenuRenderSwitchAuth(authView) {
  if (authView !== USER_MENU_AUTH_VIEW_SIGN_UP) { // Fall back to sign-in for any non-sign-up value.
    authView = USER_MENU_AUTH_VIEW_SIGN_IN; // Normalize the auth view to sign-in.
  }
  userMenuDomSet({
    showViewSignIn: authView !== USER_MENU_AUTH_VIEW_SIGN_UP, // Show the sign-in form unless sign-up is active.
    showViewSignUp: authView === USER_MENU_AUTH_VIEW_SIGN_UP, // Show the sign-up view only when sign-up is active.
    authView: authView, // Apply the active auth tab classes and thumb position.
  });
}

export {
  _userMenuRenderSignedIn as userMenuRenderSignedIn,
  _userMenuRenderSignedOut as userMenuRenderSignedOut,
  _userMenuRenderSwitchAuth as userMenuRenderSwitchAuth,
  _userMenuRenderSwitchTheme as userMenuRenderSwitchTheme,
};
