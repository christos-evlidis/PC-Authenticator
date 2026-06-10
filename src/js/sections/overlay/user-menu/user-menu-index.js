import { themeGet } from "../../../utils/utility-theme.js";
import { userMenuActionAccountCopy } from "./action/account/copy.js";
import { userMenuActionAccountDownload } from "./action/account/download.js";
import { userMenuActionAuthSignIn } from "./action/auth/sign-in.js";
import { userMenuActionAuthSignOut } from "./action/auth/sign-out.js";
import { userMenuActionAuthSignUp } from "./action/auth/sign-up.js";
import { userMenuActionAuthSwitch } from "./action/auth/switch.js";
import { userMenuActionPanelClose } from "./action/panel/close.js";
import { userMenuActionPanelOpen } from "./action/panel/open.js";
import { userMenuActionThemeSwitch } from "./action/theme/switch.js";
import { userMenuStateSet } from "./state/set.js";

import { THEME_DARK } from "../../../utils/utility-theme.js";
import { USER_MENU_ACCOUNT_COPY_BTN_SELECTOR } from "./user-menu-const.js";
import { USER_MENU_ACCOUNT_DOWNLOAD_BTN_SELECTOR } from "./user-menu-const.js";
import { USER_MENU_ACCOUNT_INPUT_SELECTOR } from "./user-menu-const.js";
import { USER_MENU_ACTIVE_CLASS } from "./user-menu-const.js";
import { USER_MENU_AUTH_BAR_SELECTOR } from "./user-menu-const.js";
import { USER_MENU_AUTH_BTN_SELECTOR } from "./user-menu-const.js";
import { USER_MENU_AUTH_VIEW_SIGN_IN } from "./user-menu-const.js";
import { USER_MENU_BACKDROP_SELECTOR } from "./user-menu-const.js";
import { USER_MENU_CLOSE_BTN_SELECTOR } from "./user-menu-const.js";
import { USER_MENU_HIDDEN_CLASS } from "./user-menu-const.js";
import { USER_MENU_LOGOUT_BTN_SELECTOR } from "./user-menu-const.js";
import { USER_MENU_OPEN_BTN_SELECTOR } from "./user-menu-const.js";
import { USER_MENU_SIGNED_IN_VIEW_SELECTOR } from "./user-menu-const.js";
import { USER_MENU_SIGNED_OUT_VIEW_SELECTOR } from "./user-menu-const.js";
import { USER_MENU_SIGN_IN_FORM_SELECTOR } from "./user-menu-const.js";
import { USER_MENU_SIGN_IN_INPUT_SELECTOR } from "./user-menu-const.js";
import { USER_MENU_SIGN_UP_BTN_SELECTOR } from "./user-menu-const.js";
import { USER_MENU_SIGN_UP_VIEW_SELECTOR } from "./user-menu-const.js";
import { USER_MENU_THEME_BAR_SELECTOR } from "./user-menu-const.js";
import { USER_MENU_THEME_BTN_SELECTOR } from "./user-menu-const.js";
import { USER_MENU_THEME_DARK_CLASS } from "./user-menu-const.js";
import { USER_MENU_THEME_LIGHT_CLASS } from "./user-menu-const.js";
import { USER_MENU_THEME_TRACK_SELECTOR } from "./user-menu-const.js";

let listenersReady = false;

/** Registers listeners once; optionally syncs signed-in/out chrome. */
function userMenuInit(isSignedIn, authNumber) {
  if (!listenersReady) {
    document.querySelectorAll(USER_MENU_OPEN_BTN_SELECTOR).forEach((button) => {
      button.addEventListener("click", userMenuActionPanelOpen);
    });

    document
      .querySelector(USER_MENU_CLOSE_BTN_SELECTOR)
      ?.addEventListener("click", userMenuActionPanelClose);

    document
      .querySelector(USER_MENU_BACKDROP_SELECTOR)
      ?.addEventListener("click", userMenuActionPanelClose);

    document.querySelectorAll(USER_MENU_AUTH_BTN_SELECTOR).forEach((button) => {
      button.addEventListener("click", () => {
        userMenuActionAuthSwitch(button.dataset.view);
      });
    });

    document.querySelectorAll(USER_MENU_THEME_BTN_SELECTOR).forEach((button) => {
      button.addEventListener("click", () => {
        void userMenuActionThemeSwitch(button.dataset.theme);
      });
    });

    document
      .querySelector(USER_MENU_SIGN_IN_FORM_SELECTOR)
      ?.addEventListener("submit", (event) => {
        event.preventDefault();

        const input = document.querySelector(USER_MENU_SIGN_IN_INPUT_SELECTOR);
        void userMenuActionAuthSignIn(input?.value);
      });

    document
      .querySelector(USER_MENU_SIGN_UP_BTN_SELECTOR)
      ?.addEventListener("click", () => {
        void userMenuActionAuthSignUp();
      });

    document
      .querySelector(USER_MENU_LOGOUT_BTN_SELECTOR)
      ?.addEventListener("click", () => {
        void userMenuActionAuthSignOut();
      });

    document
      .querySelector(USER_MENU_ACCOUNT_COPY_BTN_SELECTOR)
      ?.addEventListener("click", () => {
        void userMenuActionAccountCopy();
      });

    document
      .querySelector(USER_MENU_ACCOUNT_DOWNLOAD_BTN_SELECTOR)
      ?.addEventListener("click", () => {
        void userMenuActionAccountDownload();
      });

    const theme = themeGet();

    document.querySelector(USER_MENU_SIGN_UP_VIEW_SELECTOR)?.classList.add(USER_MENU_HIDDEN_CLASS);

    userMenuStateSet({ theme, authView: USER_MENU_AUTH_VIEW_SIGN_IN });

    document.querySelectorAll(USER_MENU_THEME_BTN_SELECTOR).forEach((button) => {
      button.classList.toggle(USER_MENU_ACTIVE_CLASS, button.dataset.theme === theme);
    });

    const themeTrack = document.querySelector(USER_MENU_THEME_TRACK_SELECTOR);
    const isDark = theme === THEME_DARK;

    themeTrack?.classList.toggle(USER_MENU_THEME_LIGHT_CLASS, !isDark);
    themeTrack?.classList.toggle(USER_MENU_THEME_DARK_CLASS, isDark);

    listenersReady = true;
  }

  if (isSignedIn === undefined) {
    return;
  }

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

export { userMenuInit };

export { userMenuActionAccountCopy } from "./action/account/copy.js";
export { userMenuActionAccountDownload } from "./action/account/download.js";
export { userMenuActionAuthSignIn } from "./action/auth/sign-in.js";
export { userMenuActionAuthSignOut } from "./action/auth/sign-out.js";
export { userMenuActionAuthSignUp } from "./action/auth/sign-up.js";
export { userMenuActionAuthSwitch } from "./action/auth/switch.js";
export { userMenuActionPanelClose } from "./action/panel/close.js";
export { userMenuActionPanelOpen } from "./action/panel/open.js";
export { userMenuActionThemeSwitch } from "./action/theme/switch.js";
export { userMenuAnimationAccountCopy } from "./animation/account/copy.js";
export { userMenuAnimationAccountDownload } from "./animation/account/download.js";
export { userMenuAnimationAuthSignIn } from "./animation/auth/sign-in.js";
export { userMenuAnimationAuthSignOut } from "./animation/auth/sign-out.js";
export { userMenuAnimationAuthSignUp } from "./animation/auth/sign-up.js";
export { userMenuAnimationAuthSwitch } from "./animation/auth/switch.js";
export { userMenuAnimationPanelClose } from "./animation/panel/close.js";
export { userMenuAnimationPanelOpen } from "./animation/panel/open.js";
export { userMenuAnimationThemeSwitch } from "./animation/theme/switch.js";
export { userMenuStateGet } from "./state/get.js";
export { userMenuStateSet } from "./state/set.js";
export { userMenuStateStore } from "./state/store.js";
