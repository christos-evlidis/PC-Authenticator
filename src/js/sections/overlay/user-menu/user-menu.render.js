import { userMenuDomGet, userMenuDomSet } from "./user-menu.dom.js";
import { userMenuStateSet } from "./user-menu.state.js";
import { userMenuAnimationSwitchAuth } from "./user-menu.animation.js";
import { USER_MENU_ACTIVE_CLASS, USER_MENU_THEME_LIGHT_CLASS, USER_MENU_THEME_DARK_CLASS, USER_MENU_AUTH_VIEW_SIGN_UP, USER_MENU_AUTH_VIEW_SIGN_IN, USER_MENU_AUTH_SIGN_UP_CLASS } from "./user-menu.constants.js";
import { THEME_DARK } from "../../../theme/theme.js";

// Renders the user menu in the signed-in state.
function userMenuRenderSignedIn(number) {
  userMenuStateSet({ stateAuth: true });

  userMenuDomSet({
    showBarAuth: false,
    showBarTheme: true,
    showViewSignedOut: false,
    showViewSignedIn: true,
    accountFieldSignedIn: number ?? "",
  });
}

// Renders the user menu in the signed-out state.
function userMenuRenderSignedOut() {
  userMenuStateSet({ stateAuth: false });

  userMenuDomSet({
    showBarAuth: true,
    showBarTheme: false,
    showViewSignedOut: true,
    showViewSignedIn: false,
    accountFieldSignedIn: "",
  });
}

// Updates the UI to reflect the selected theme.
function userMenuRenderTheme(theme) {
  const dom = userMenuDomGet();
  const isDark = theme === THEME_DARK;

  dom.themeBtns.forEach((button) => {
    button.classList.toggle(USER_MENU_ACTIVE_CLASS, button.dataset.theme === theme);
  });

  dom.themeTrack?.classList.toggle(USER_MENU_THEME_LIGHT_CLASS, !isDark);
  dom.themeTrack?.classList.toggle(USER_MENU_THEME_DARK_CLASS, isDark);
}

// Switches the authentication view between sign-in and sign-up.
function userMenuAuthSwitch(view) {
  const nextView = view === USER_MENU_AUTH_VIEW_SIGN_UP
    ? USER_MENU_AUTH_VIEW_SIGN_UP
    : USER_MENU_AUTH_VIEW_SIGN_IN;

  const dom = userMenuDomGet();
  const isSignUp = nextView === USER_MENU_AUTH_VIEW_SIGN_UP;

  if (dom.authTrack?.classList.contains(USER_MENU_AUTH_SIGN_UP_CLASS) === isSignUp) {
    return;
  }

  userMenuDomSet({
    showViewSignIn: !isSignUp,
    showViewSignUp: isSignUp,
  });

  dom.authBtns.forEach((button) => {
    button.classList.toggle(USER_MENU_ACTIVE_CLASS, button.dataset.view === nextView);
  });

  void userMenuAnimationSwitchAuth(nextView);
}

export { userMenuAuthSwitch, userMenuRenderSignedIn, userMenuRenderSignedOut, userMenuRenderTheme };
