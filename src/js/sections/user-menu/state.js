import { USER_MENU_AUTH_VIEW_SIGN_IN } from "./constants.js";
import { themeRead } from "../../utils/utility-theme.js";
import { THEME_LIGHT } from "../../utils/utility-theme.js";

// Stores the in-memory user-menu snapshot that drives section rendering.
let userMenuState = {
  isOpen: false,
  isSignedIn: false,
  isSignInRunning: false,
  authNumber: null,
  authView: USER_MENU_AUTH_VIEW_SIGN_IN,
  theme: themeRead() || THEME_LIGHT,
};

/** Returns a snapshot so callers cannot mutate the shared state directly. */
export function userMenuStateGet() {
  return {
    isOpen: userMenuState.isOpen,
    isSignedIn: userMenuState.isSignedIn,
    isSignInRunning: userMenuState.isSignInRunning,
    authNumber: userMenuState.authNumber,
    authView: userMenuState.authView,
    theme: userMenuState.theme,
  };
}

/** Updates only the state fields supplied by the caller and preserves the rest. */
export function userMenuStateSet(next) {
  const isSignedIn =
    typeof next.isSignedIn === "boolean"
      ? next.isSignedIn
      : userMenuState.isSignedIn;

  let authNumber = userMenuState.authNumber;

  if (typeof next.isSignedIn === "boolean") {
    authNumber =
      next.isSignedIn && typeof next.authNumber === "string"
        ? next.authNumber
        : null;
  } else if (typeof next.authNumber === "string") {
    authNumber = next.authNumber;
  } else if (next.authNumber === null) {
    authNumber = null;
  }

  userMenuState = {
    isOpen: typeof next.isOpen === "boolean" ? next.isOpen : userMenuState.isOpen,
    isSignedIn,
    isSignInRunning:
      typeof next.isSignInRunning === "boolean"
        ? next.isSignInRunning
        : userMenuState.isSignInRunning,
    authNumber,
    authView:
      typeof next.authView === "string" ? next.authView : userMenuState.authView,
    theme: typeof next.theme === "string" ? next.theme : userMenuState.theme,
  };
}
