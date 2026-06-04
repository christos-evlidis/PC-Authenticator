import { USER_MENU_AUTH_VIEW_SIGN_IN } from "./user-menu-constants.js";
import { themeRead } from "../../utils/utility-theme.js";
import { THEME_LIGHT } from "../../utils/utility-theme.js";

// Stores the in-memory user-menu snapshot that drives section rendering.
let userMenuState = {
  isOpen: false,
  isSignedIn: false,
  isSignInRunning: false,
  accountNumber: null,
  authView: USER_MENU_AUTH_VIEW_SIGN_IN,
  theme: themeRead() || THEME_LIGHT,
};

// Returns a snapshot so callers cannot mutate the shared state directly.
export function userMenuStateGet() {
  return {
    isOpen: userMenuState.isOpen,
    isSignedIn: userMenuState.isSignedIn,
    isSignInRunning: userMenuState.isSignInRunning,
    accountNumber: userMenuState.accountNumber,
    authView: userMenuState.authView,
    theme: userMenuState.theme,
  };
}

// Updates only the state fields supplied by the caller and preserves the rest.
export function userMenuStateSet(next) {
  const isSignedIn =
    typeof next.isSignedIn === "boolean"
      ? next.isSignedIn
      : userMenuState.isSignedIn;

  let accountNumber = userMenuState.accountNumber;

  if (typeof next.isSignedIn === "boolean") {
    accountNumber =
      next.isSignedIn && typeof next.accountNumber === "string"
        ? next.accountNumber
        : null;
  } else if (typeof next.accountNumber === "string") {
    accountNumber = next.accountNumber;
  } else if (next.accountNumber === null) {
    accountNumber = null;
  }

  userMenuState = {
    isOpen: typeof next.isOpen === "boolean" ? next.isOpen : userMenuState.isOpen,
    isSignedIn,
    isSignInRunning:
      typeof next.isSignInRunning === "boolean"
        ? next.isSignInRunning
        : userMenuState.isSignInRunning,
    accountNumber,
    authView:
      typeof next.authView === "string" ? next.authView : userMenuState.authView,
    theme: typeof next.theme === "string" ? next.theme : userMenuState.theme,
  };
}
