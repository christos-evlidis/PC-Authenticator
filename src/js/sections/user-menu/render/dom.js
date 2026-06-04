import { themeRead } from "../../../utils/utility-theme.js";
import { USER_MENU_AUTH_BAR_SELECTOR } from "../constants.js";
import { USER_MENU_AUTH_VIEW_SIGN_IN } from "../constants.js";
import { USER_MENU_HIDDEN_CLASS } from "../constants.js";
import { USER_MENU_SIGNED_IN_VIEW_SELECTOR } from "../constants.js";
import { USER_MENU_SIGNED_OUT_VIEW_SELECTOR } from "../constants.js";
import { USER_MENU_THEME_BAR_SELECTOR } from "../constants.js";
import { userMenuStateGet } from "../state.js";
import { userMenuStateSet } from "../state.js";
import { userMenuAccountApply } from "./account.js";
import { userMenuAuthTrackApply } from "./auth.js";
import { userMenuAuthViewApply } from "./auth.js";
import { userMenuThemeButtonsApply } from "./theme.js";
import { userMenuThemeTrackApply } from "./theme.js";

/** Syncs all user-menu DOM from the current in-memory state. */
export function userMenuDomApply() {
  const state = userMenuStateGet();
  const theme = themeRead();

  userMenuStateSet({ theme });

  const authBar = document.querySelector(USER_MENU_AUTH_BAR_SELECTOR);
  const themeBar = document.querySelector(USER_MENU_THEME_BAR_SELECTOR);
  const signedOutView = document.querySelector(USER_MENU_SIGNED_OUT_VIEW_SELECTOR);
  const signedInView = document.querySelector(USER_MENU_SIGNED_IN_VIEW_SELECTOR);

  authBar?.classList.toggle(USER_MENU_HIDDEN_CLASS, state.isSignedIn);
  themeBar?.classList.toggle(USER_MENU_HIDDEN_CLASS, !state.isSignedIn);
  signedOutView?.classList.toggle(USER_MENU_HIDDEN_CLASS, state.isSignedIn);
  signedInView?.classList.toggle(USER_MENU_HIDDEN_CLASS, !state.isSignedIn);
  userMenuAccountApply(state.accountNumber);
  userMenuAuthViewApply(state.authView || USER_MENU_AUTH_VIEW_SIGN_IN);
  userMenuAuthTrackApply(state.authView || USER_MENU_AUTH_VIEW_SIGN_IN);
  userMenuThemeButtonsApply(theme);
  userMenuThemeTrackApply(theme);
}
