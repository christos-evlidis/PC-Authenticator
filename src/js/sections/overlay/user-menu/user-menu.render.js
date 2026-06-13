import { userMenuDomSet } from "./user-menu.dom.js";
import { userMenuStateSet } from "./user-menu.state.js";

import { THEME_DARK_KEY } from "../../../app/app.actions.js";
import { THEME_LIGHT_KEY } from "../../../app/app.actions.js";

import { USER_MENU_AUTH_VIEW_SIGN_IN } from "../../../const/const.user-menu.js";
import { USER_MENU_AUTH_VIEW_SIGN_UP } from "../../../const/const.user-menu.js";


// Renders the user menu in the signed-in state.
function userMenuRenderSignedIn(authKey) {
  userMenuStateSet({ stateAuth: true });
  userMenuDomSet({
    showBarAuth: false,
    showBarTheme: true,
    showViewSignedOut: false,
    showViewSignedIn: true,
    accountFieldSignedIn: authKey ?? "",
  });
}

// Renders the user menu in the signed-out state.
function userMenuRenderSignedOut(authKey) {
  userMenuStateSet({ stateAuth: false });
  userMenuDomSet({
    showBarAuth: true,
    showBarTheme: false,
    showViewSignedOut: true,
    showViewSignedIn: false,
    accountFieldSignedIn: "",
    accountFieldSignedOut: authKey,
  });
}

// Updates the UI to reflect the selected theme.
function userMenuRenderSwitchTheme(themeView) {
  if (themeView !== THEME_DARK_KEY) {
    themeView = THEME_LIGHT_KEY;
  }
  userMenuDomSet({ theme: themeView });
}

// Updates the UI to reflect the selected authentication view.
function userMenuRenderSwitchAuth(authView) {
  if (authView !== USER_MENU_AUTH_VIEW_SIGN_UP) {
    authView = USER_MENU_AUTH_VIEW_SIGN_IN;
  }
  userMenuDomSet({
    showViewSignIn: authView !== USER_MENU_AUTH_VIEW_SIGN_UP,
    showViewSignUp: authView === USER_MENU_AUTH_VIEW_SIGN_UP,
    authView: authView,
  });
}


export { userMenuRenderSignedIn };
export { userMenuRenderSignedOut };
export { userMenuRenderSwitchTheme };
export { userMenuRenderSwitchAuth };
