export { userMenuSignIn } from "./actions/sign-in.js";
export { userMenuSignUp } from "./actions/sign-up.js";
export { userMenuSignOut } from "./actions/sign-out.js";
export { userMenuPanelOpen } from "./actions/open.js";
export { userMenuPanelClose } from "./actions/close.js";
export { userMenuThemeSwitch } from "./actions/theme-switch.js";

export { USER_MENU_ACCOUNT_NUMBER_KEY } from "./constants.js";
export { USER_MENU_ACCOUNT_NUMBER_LENGTH } from "./constants.js";

import { USER_MENU_ACCOUNT_COPY_BTN_SELECTOR } from "./constants.js";
import { USER_MENU_ACCOUNT_DOWNLOAD_BTN_SELECTOR } from "./constants.js";
import { USER_MENU_AUTH_BTN_SELECTOR } from "./constants.js";
import { USER_MENU_BACKDROP_SELECTOR } from "./constants.js";
import { USER_MENU_CLOSE_BTN_SELECTOR } from "./constants.js";
import { USER_MENU_LOGOUT_BTN_SELECTOR } from "./constants.js";
import { USER_MENU_OPEN_BTN_SELECTOR } from "./constants.js";
import { USER_MENU_SIGN_IN_FORM_SELECTOR } from "./constants.js";
import { USER_MENU_SIGN_IN_INPUT_SELECTOR } from "./constants.js";
import { USER_MENU_SIGN_UP_BTN_SELECTOR } from "./constants.js";
import { USER_MENU_THEME_BTN_SELECTOR } from "./constants.js";
import { userMenuAccountCopy } from "./actions/copy.js";
import { userMenuAccountDownload } from "./actions/download.js";
import { userMenuAuthSwitch } from "./actions/auth-switch.js";
import { userMenuPanelClose } from "./actions/close.js";
import { userMenuPanelOpen } from "./actions/open.js";
import { userMenuSignIn } from "./actions/sign-in.js";
import { userMenuSignOut } from "./actions/sign-out.js";
import { userMenuSignUp } from "./actions/sign-up.js";
import { userMenuThemeSwitch } from "./actions/theme-switch.js";
import { userMenuAccountApply } from "./render/account.js";
import { userMenuDomApply } from "./render/dom.js";
import { userMenuViewsApply } from "./render/views.js";
import { userMenuStateSet } from "./state.js";
import { refreshAuth } from "../../utils/utility-auth.js";

/** Applies user-menu auth state in memory and updates signed-in/out DOM. */
export function userMenuApply(isSignedIn, accountNumber = null) {
  userMenuStateSet({
    isSignedIn,
    accountNumber: isSignedIn ? accountNumber : null,
  });

  userMenuViewsApply(isSignedIn);
  userMenuAccountApply(isSignedIn ? accountNumber : null);
}

/** Registers user-menu listeners and syncs from storage. */
export function userMenuInit() {
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

  void refreshAuth().then(() => {
    userMenuDomApply();
  });
}
