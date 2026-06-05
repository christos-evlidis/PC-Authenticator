import { userMenuAccountCopy } from "./actions/copy.js";
import { userMenuAccountDownload } from "./actions/download.js";
import { userMenuAuthSwitch } from "./actions/auth-switch.js";
import { userMenuPanelClose } from "./actions/close.js";
import { userMenuPanelOpen } from "./actions/open.js";
import { userMenuSignIn } from "./actions/sign-in.js";
import { userMenuSignOut } from "./actions/sign-out.js";
import { userMenuSignUp } from "./actions/sign-up.js";
import { userMenuThemeSwitch } from "./actions/theme-switch.js";
import { userMenuStateGet } from "./state.js";
import { userMenuStateSet } from "./state.js";
import { themeGet } from "../../utils/utility-theme.js";

import { USER_MENU_ACCOUNT_COPY_BTN_SELECTOR } from "./constants.js";
import { USER_MENU_ACCOUNT_DOWNLOAD_BTN_SELECTOR } from "./constants.js";
import { USER_MENU_ACCOUNT_INPUT_SELECTOR } from "./constants.js";
import { USER_MENU_ACTIVE_CLASS } from "./constants.js";
import { USER_MENU_AUTH_BAR_SELECTOR } from "./constants.js";
import { USER_MENU_AUTH_BTN_SELECTOR } from "./constants.js";
import { USER_MENU_AUTH_SIGN_IN_CLASS } from "./constants.js";
import { USER_MENU_AUTH_SIGN_UP_CLASS } from "./constants.js";
import { USER_MENU_AUTH_TRACK_SELECTOR } from "./constants.js";
import { USER_MENU_AUTH_VIEW_SIGN_IN } from "./constants.js";
import { USER_MENU_AUTH_VIEW_SIGN_UP } from "./constants.js";
import { USER_MENU_BACKDROP_SELECTOR } from "./constants.js";
import { USER_MENU_CLOSE_BTN_SELECTOR } from "./constants.js";
import { USER_MENU_HIDDEN_CLASS } from "./constants.js";
import { USER_MENU_LOGOUT_BTN_SELECTOR } from "./constants.js";
import { USER_MENU_OPEN_BTN_SELECTOR } from "./constants.js";
import { USER_MENU_SIGN_IN_FORM_SELECTOR } from "./constants.js";
import { USER_MENU_SIGN_IN_INPUT_SELECTOR } from "./constants.js";
import { USER_MENU_SIGN_IN_VIEW_SELECTOR } from "./constants.js";
import { USER_MENU_SIGN_UP_BTN_SELECTOR } from "./constants.js";
import { USER_MENU_SIGN_UP_VIEW_SELECTOR } from "./constants.js";
import { USER_MENU_SIGNED_IN_VIEW_SELECTOR } from "./constants.js";
import { USER_MENU_SIGNED_OUT_VIEW_SELECTOR } from "./constants.js";
import { USER_MENU_THEME_BAR_SELECTOR } from "./constants.js";
import { USER_MENU_THEME_BTN_SELECTOR } from "./constants.js";
import { USER_MENU_THEME_DARK_CLASS } from "./constants.js";
import { USER_MENU_THEME_LIGHT_CLASS } from "./constants.js";
import { USER_MENU_THEME_TRACK_SELECTOR } from "./constants.js";
import { THEME_DARK } from "../../utils/utility-theme.js";

/** Applies user-menu auth state in memory and updates signed-in/out DOM. */
function userMenuApply(isSignedIn, authNumber) {
  userMenuStateSet({
    isSignedIn,
    authNumber: isSignedIn ? authNumber : null,
  });

  const authBar = document.querySelector(USER_MENU_AUTH_BAR_SELECTOR);
  const themeBar = document.querySelector(USER_MENU_THEME_BAR_SELECTOR);
  const signedOutView = document.querySelector(USER_MENU_SIGNED_OUT_VIEW_SELECTOR);
  const signedInView = document.querySelector(USER_MENU_SIGNED_IN_VIEW_SELECTOR);

  authBar?.classList.toggle(USER_MENU_HIDDEN_CLASS, isSignedIn);
  themeBar?.classList.toggle(USER_MENU_HIDDEN_CLASS, !isSignedIn);
  signedOutView?.classList.toggle(USER_MENU_HIDDEN_CLASS, isSignedIn);
  signedInView?.classList.toggle(USER_MENU_HIDDEN_CLASS, !isSignedIn);

  const accountInput = document.querySelector(USER_MENU_ACCOUNT_INPUT_SELECTOR);

  if (accountInput) {
    accountInput.value = isSignedIn ? (authNumber ?? "") : "";
  }
}

/** Registers user-menu listeners and syncs from storage. */
function userMenuInit() {
  document.querySelectorAll(USER_MENU_OPEN_BTN_SELECTOR).forEach((button) => {
    button.addEventListener("click", userMenuPanelOpen);
  });

  document
    .querySelector(USER_MENU_CLOSE_BTN_SELECTOR)
    ?.addEventListener("click", userMenuPanelClose);

  document
    .querySelector(USER_MENU_BACKDROP_SELECTOR)
    ?.addEventListener("click", userMenuPanelClose);

  document.querySelectorAll(USER_MENU_AUTH_BTN_SELECTOR).forEach((button) => {
    button.addEventListener("click", () => {
      userMenuAuthSwitch(button.dataset.view);
    });
  });

  document.querySelectorAll(USER_MENU_THEME_BTN_SELECTOR).forEach((button) => {
    button.addEventListener("click", () => {
      void userMenuThemeSwitch(button.dataset.theme);
    });
  });

  document
    .querySelector(USER_MENU_SIGN_IN_FORM_SELECTOR)
    ?.addEventListener("submit", (event) => {
      event.preventDefault();

      const input = document.querySelector(USER_MENU_SIGN_IN_INPUT_SELECTOR);
      void userMenuSignIn(input?.value);
    });

  document
    .querySelector(USER_MENU_SIGN_UP_BTN_SELECTOR)
    ?.addEventListener("click", () => {
      void userMenuSignUp();
    });

  document
    .querySelector(USER_MENU_LOGOUT_BTN_SELECTOR)
    ?.addEventListener("click", () => {
      void userMenuSignOut();
    });

  document
    .querySelector(USER_MENU_ACCOUNT_COPY_BTN_SELECTOR)
    ?.addEventListener("click", () => {
      void userMenuAccountCopy();
    });

  document
    .querySelector(USER_MENU_ACCOUNT_DOWNLOAD_BTN_SELECTOR)
    ?.addEventListener("click", () => {
      void userMenuAccountDownload();
    });

  const theme = themeGet();

  userMenuStateSet({ theme });

  document.querySelectorAll(USER_MENU_THEME_BTN_SELECTOR).forEach((button) => {
    button.classList.toggle(USER_MENU_ACTIVE_CLASS, button.dataset.theme === theme);
  });

  const themeTrack = document.querySelector(USER_MENU_THEME_TRACK_SELECTOR);
  const isDark = theme === THEME_DARK;

  themeTrack?.classList.toggle(USER_MENU_THEME_LIGHT_CLASS, !isDark);
  themeTrack?.classList.toggle(USER_MENU_THEME_DARK_CLASS, isDark);
}

export { userMenuSignIn } from "./actions/sign-in.js";
export { userMenuSignUp } from "./actions/sign-up.js";
export { userMenuSignOut } from "./actions/sign-out.js";
export { userMenuPanelOpen } from "./actions/open.js";
export { userMenuPanelClose } from "./actions/close.js";
export { userMenuThemeSwitch } from "./actions/theme-switch.js";
export { userMenuApply };
export { userMenuInit };
