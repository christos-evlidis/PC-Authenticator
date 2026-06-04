export { userMenuSignIn } from "./user-menu-actions/user-menu-sign-in.js";
export { userMenuSignUp } from "./user-menu-actions/user-menu-sign-up.js";
export { userMenuSignOut } from "./user-menu-actions/user-menu-sign-out.js";
export { userMenuPanelOpen } from "./user-menu-actions/user-menu-open.js";
export { userMenuPanelClose } from "./user-menu-actions/user-menu-close.js";
export { userMenuThemeSwitch } from "./user-menu-actions/user-menu-theme-switch.js";

export { USER_MENU_ACCOUNT_NUMBER_KEY } from "./user-menu-constants.js";
export { USER_MENU_ACCOUNT_NUMBER_LENGTH } from "./user-menu-constants.js";

import { USER_MENU_ACCOUNT_COPY_BTN_SELECTOR } from "./user-menu-constants.js";
import { USER_MENU_ACCOUNT_DOWNLOAD_BTN_SELECTOR } from "./user-menu-constants.js";
import { USER_MENU_AUTH_BTN_SELECTOR } from "./user-menu-constants.js";
import { USER_MENU_BACKDROP_SELECTOR } from "./user-menu-constants.js";
import { USER_MENU_CLOSE_BTN_SELECTOR } from "./user-menu-constants.js";
import { USER_MENU_LOGOUT_BTN_SELECTOR } from "./user-menu-constants.js";
import { USER_MENU_OPEN_BTN_SELECTOR } from "./user-menu-constants.js";
import { USER_MENU_SIGN_IN_FORM_SELECTOR } from "./user-menu-constants.js";
import { USER_MENU_SIGN_IN_INPUT_SELECTOR } from "./user-menu-constants.js";
import { USER_MENU_SIGN_UP_BTN_SELECTOR } from "./user-menu-constants.js";
import { USER_MENU_THEME_BTN_SELECTOR } from "./user-menu-constants.js";
import { userMenuAccountCopy } from "./user-menu-actions/user-menu-copy.js";
import { userMenuAccountDownload } from "./user-menu-actions/user-menu-download.js";
import { userMenuAuthSwitch } from "./user-menu-actions/user-menu-auth-switch.js";
import { userMenuPanelClose } from "./user-menu-actions/user-menu-close.js";
import { userMenuPanelOpen } from "./user-menu-actions/user-menu-open.js";
import { userMenuSignIn } from "./user-menu-actions/user-menu-sign-in.js";
import { userMenuSignOut } from "./user-menu-actions/user-menu-sign-out.js";
import { userMenuSignUp } from "./user-menu-actions/user-menu-sign-up.js";
import { userMenuThemeSwitch } from "./user-menu-actions/user-menu-theme-switch.js";
import { userMenuAccountApply } from "./user-menu-render/user-menu-account.js";
import { userMenuDomApply } from "./user-menu-render/user-menu-dom.js";
import { userMenuViewsApply } from "./user-menu-render/user-menu-views.js";
import { userMenuStateSet } from "./user-menu-state.js";
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
