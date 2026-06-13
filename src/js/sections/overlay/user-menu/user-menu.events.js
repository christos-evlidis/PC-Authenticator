import { userMenuAccountNumberCopy } from "./action/user-menu.account.js";
import { userMenuAccountNumberDownload } from "./action/user-menu.account.js";

import { userMenuAuthSignIn } from "./action/user-menu.auth.js";
import { userMenuAuthSignOut } from "./action/user-menu.auth.js";
import { userMenuAuthSignUp } from "./action/user-menu.auth.js";

import { userMenuSwitchAuth } from "./action/user-menu.view.js";
import { userMenuSwitchTheme } from "./action/user-menu.view.js";

import { userMenuDomGet } from "./user-menu.dom.js";
import { userMenuDomSet } from "./user-menu.dom.js";

import { userMenuPanelClose } from "./action/user-menu.panel.js";
import { userMenuPanelToggle } from "./action/user-menu.panel.js";

import { USER_MENU_ACCOUNT_FIELD_SIGNED_OUT_SELECTOR } from "../../../const/const.user-menu.js";


let userMenuEventsBound = false;

// Binds all event listeners for the user menu.
function userMenuEventsBind() {
  if (userMenuEventsBound) {
    return;
  }
  userMenuEventsBound = true;
  const dom = userMenuDomGet();
  dom.openBtns.forEach((button) => {
    button.addEventListener("click", userMenuPanelToggle);
  });
  dom.closeBtn?.addEventListener("click", userMenuPanelClose);
  dom.backdrop?.addEventListener("click", userMenuPanelClose);
  dom.authBtns.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      userMenuSwitchAuth(event.currentTarget.dataset.view);
    });
  });
  dom.themeBtns.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      void userMenuSwitchTheme(event.currentTarget.dataset.theme);
    });
  });
  dom.signInForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    void userMenuAuthSignIn(event.currentTarget.querySelector(USER_MENU_ACCOUNT_FIELD_SIGNED_OUT_SELECTOR)?.value);
  });
  dom.signUpBtn?.addEventListener("click", () => {
    void userMenuAuthSignUp();
  });
  dom.logoutBtn?.addEventListener("click", () => {
    void userMenuAuthSignOut();
  });
  dom.accountCopyBtn?.addEventListener("click", () => {
    void userMenuAccountNumberCopy();
  });
  dom.accountDownloadBtn?.addEventListener("click", () => {
    void userMenuAccountNumberDownload();
  });
  userMenuDomSet({ showViewSignUp: false });
}


export { userMenuEventsBind };
