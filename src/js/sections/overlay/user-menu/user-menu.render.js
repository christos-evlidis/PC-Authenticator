import { userMenuDomSet } from "./user-menu.dom.js";
import { userMenuStateSet } from "./user-menu.state.js";
import { USER_MENU_ACTIVE_CLASS } from "./user-menu.constants.js";
import { USER_MENU_THEME_LIGHT_CLASS } from "./user-menu.constants.js";
import { USER_MENU_THEME_DARK_CLASS } from "./user-menu.constants.js";
import { USER_MENU_AUTH_VIEW_SIGN_IN } from "./user-menu.constants.js";
import { USER_MENU_AUTH_VIEW_SIGN_UP } from "./user-menu.constants.js";
import { THEME_DARK_KEY } from "../../../services/theme/theme-index.js";
import { THEME_LIGHT_KEY } from "../../../services/theme/theme-index.js";

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
function userMenuRenderSignedOut(authNumber) {
  userMenuStateSet({ stateAuth: false });

  userMenuDomSet({
    showBarAuth: true,
    showBarTheme: false,
    showViewSignedOut: true,
    showViewSignedIn: false,
    accountFieldSignedIn: "",
    accountFieldSignedOut: authNumber,
  });
}

// Updates the UI to reflect the selected theme.
function userMenuRenderSwitchTheme(theme) {
  if (theme !== THEME_DARK_KEY) {
    theme = THEME_LIGHT_KEY;
  }

  const isDark = theme === THEME_DARK_KEY;
  const dom = userMenuDomSet();

  dom.themeBtns.forEach((button) => {
    button.classList.toggle(USER_MENU_ACTIVE_CLASS, button.dataset.theme === theme);
  });

  dom.themeTrack?.classList.toggle(USER_MENU_THEME_LIGHT_CLASS, !isDark);
  dom.themeTrack?.classList.toggle(USER_MENU_THEME_DARK_CLASS, isDark);
}

// Updates the UI to reflect the selected authentication view.
function userMenuRenderSwitchAuth(view) {
  if (view !== USER_MENU_AUTH_VIEW_SIGN_UP) {
    view = USER_MENU_AUTH_VIEW_SIGN_IN;
  }
  
  const isSignUp = view === USER_MENU_AUTH_VIEW_SIGN_UP;
  const dom = userMenuDomSet({
    showViewSignIn: !isSignUp,
    showViewSignUp: isSignUp,
  });

  dom.authBtns.forEach((button) => {
    button.classList.toggle(USER_MENU_ACTIVE_CLASS, button.dataset.view === view);
  });
}

export { userMenuRenderSignedIn };
export { userMenuRenderSignedOut };
export { userMenuRenderSwitchTheme };
export { userMenuRenderSwitchAuth };
