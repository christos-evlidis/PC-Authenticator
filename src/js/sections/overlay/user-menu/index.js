import { themeGet } from "../../../utils/utility-theme.js";
import { userMenuActionsAccountCopy } from "./action/account/copy.js";
import { userMenuActionsAccountDownload } from "./action/account/download.js";
import { userMenuActionsAuthSignIn } from "./action/auth/sign-in.js";
import { userMenuActionsAuthSignOut } from "./action/auth/sign-out.js";
import { userMenuActionsAuthSignUp } from "./action/auth/sign-up.js";
import { userMenuActionsAuthSwitch } from "./action/auth/switch.js";
import { userMenuActionsPanelClose } from "./action/panel/close.js";
import { userMenuActionsPanelOpen } from "./action/panel/open.js";
import { userMenuActionsThemeSwitch } from "./action/theme/switch.js";
import { userMenuStateSet } from "./state/set.js";

import { THEME_DARK } from "../../../utils/utility-theme.js";
import { USER_MENU_ACCOUNT_COPY_BTN_SELECTOR } from "./constants.js";
import { USER_MENU_ACCOUNT_DOWNLOAD_BTN_SELECTOR } from "./constants.js";
import { USER_MENU_ACCOUNT_INPUT_SELECTOR } from "./constants.js";
import { USER_MENU_ACTIVE_CLASS } from "./constants.js";
import { USER_MENU_AUTH_BAR_SELECTOR } from "./constants.js";
import { USER_MENU_AUTH_BTN_SELECTOR } from "./constants.js";
import { USER_MENU_AUTH_VIEW_SIGN_IN } from "./constants.js";
import { USER_MENU_BACKDROP_SELECTOR } from "./constants.js";
import { USER_MENU_CLOSE_BTN_SELECTOR } from "./constants.js";
import { USER_MENU_HIDDEN_CLASS } from "./constants.js";
import { USER_MENU_LOGOUT_BTN_SELECTOR } from "./constants.js";
import { USER_MENU_OPEN_BTN_SELECTOR } from "./constants.js";
import { USER_MENU_SIGNED_IN_VIEW_SELECTOR } from "./constants.js";
import { USER_MENU_SIGNED_OUT_VIEW_SELECTOR } from "./constants.js";
import { USER_MENU_SIGN_IN_FORM_SELECTOR } from "./constants.js";
import { USER_MENU_SIGN_IN_INPUT_SELECTOR } from "./constants.js";
import { USER_MENU_SIGN_UP_BTN_SELECTOR } from "./constants.js";
import { USER_MENU_SIGN_UP_VIEW_SELECTOR } from "./constants.js";
import { USER_MENU_THEME_BAR_SELECTOR } from "./constants.js";
import { USER_MENU_THEME_BTN_SELECTOR } from "./constants.js";
import { USER_MENU_THEME_DARK_CLASS } from "./constants.js";
import { USER_MENU_THEME_LIGHT_CLASS } from "./constants.js";
import { USER_MENU_THEME_TRACK_SELECTOR } from "./constants.js";

function userMenuInit(isSignedIn, authNumber) {
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

/** Registers user-menu listeners and syncs theme from storage. */
function userMenuEventsInit() {
  document.querySelectorAll(USER_MENU_OPEN_BTN_SELECTOR).forEach((button) => {
    button.addEventListener("click", userMenuActionsPanelOpen);
  });

  document
    .querySelector(USER_MENU_CLOSE_BTN_SELECTOR)
    ?.addEventListener("click", userMenuActionsPanelClose);

  document
    .querySelector(USER_MENU_BACKDROP_SELECTOR)
    ?.addEventListener("click", userMenuActionsPanelClose);

  document.querySelectorAll(USER_MENU_AUTH_BTN_SELECTOR).forEach((button) => {
    button.addEventListener("click", () => {
      userMenuActionsAuthSwitch(button.dataset.view);
    });
  });

  document.querySelectorAll(USER_MENU_THEME_BTN_SELECTOR).forEach((button) => {
    button.addEventListener("click", () => {
      void userMenuActionsThemeSwitch(button.dataset.theme);
    });
  });

  document
    .querySelector(USER_MENU_SIGN_IN_FORM_SELECTOR)
    ?.addEventListener("submit", (event) => {
      event.preventDefault();

      const input = document.querySelector(USER_MENU_SIGN_IN_INPUT_SELECTOR);
      void userMenuActionsAuthSignIn(input?.value);
    });

  document
    .querySelector(USER_MENU_SIGN_UP_BTN_SELECTOR)
    ?.addEventListener("click", () => {
      void userMenuActionsAuthSignUp();
    });

  document
    .querySelector(USER_MENU_LOGOUT_BTN_SELECTOR)
    ?.addEventListener("click", () => {
      void userMenuActionsAuthSignOut();
    });

  document
    .querySelector(USER_MENU_ACCOUNT_COPY_BTN_SELECTOR)
    ?.addEventListener("click", () => {
      void userMenuActionsAccountCopy();
    });

  document
    .querySelector(USER_MENU_ACCOUNT_DOWNLOAD_BTN_SELECTOR)
    ?.addEventListener("click", () => {
      void userMenuActionsAccountDownload();
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
}

export { userMenuEventsInit };
export { userMenuInit };
