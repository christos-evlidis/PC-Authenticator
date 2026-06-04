import { USER_MENU_AUTH_BAR_SELECTOR } from "../constants.js";
import { USER_MENU_HIDDEN_CLASS } from "../constants.js";
import { USER_MENU_SIGNED_IN_VIEW_SELECTOR } from "../constants.js";
import { USER_MENU_SIGNED_OUT_VIEW_SELECTOR } from "../constants.js";
import { USER_MENU_THEME_BAR_SELECTOR } from "../constants.js";

/** Updates signed-in vs signed-out view visibility in the DOM. */
export function userMenuViewsApply(isSignedIn) {
  const authBar = document.querySelector(USER_MENU_AUTH_BAR_SELECTOR);
  const themeBar = document.querySelector(USER_MENU_THEME_BAR_SELECTOR);
  const signedOutView = document.querySelector(
    USER_MENU_SIGNED_OUT_VIEW_SELECTOR,
  );
  const signedInView = document.querySelector(USER_MENU_SIGNED_IN_VIEW_SELECTOR);

  authBar?.classList.toggle(USER_MENU_HIDDEN_CLASS, isSignedIn);
  themeBar?.classList.toggle(USER_MENU_HIDDEN_CLASS, !isSignedIn);
  signedOutView?.classList.toggle(USER_MENU_HIDDEN_CLASS, isSignedIn);
  signedInView?.classList.toggle(USER_MENU_HIDDEN_CLASS, !isSignedIn);
}
