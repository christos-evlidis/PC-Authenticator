import { AUTH_NUMBER_LENGTH } from "../../../../../accounts/accounts-const.js";
import { authApiVerify } from "../../../../../accounts/accounts-index.js";
import { authSanitizeNumber } from "../../../../../accounts/accounts-index.js";
import { authStorageGet } from "../../../../../accounts/accounts-index.js";
import { authStorageSet } from "../../../../../accounts/accounts-index.js";
import { dataHandleSync } from "../../../../../accounts/accounts-index.js";
import { bodyAnimationFinish } from "../../../../shell/body/body-index.js";
import { codesLoadStart } from "../../../../shell/codes/codes-index.js";
import { authChromeApply } from "../../../../../utils/utility-auth.js";
import { THEME_DARK } from "../../../../../utils/utility-theme.js";
import { themeGet } from "../../../../../utils/utility-theme.js";
import { userMenuAnimationAuthSignIn } from "../../animation/auth/sign-in.js";
import { userMenuStateGet } from "../../state/get.js";

import { USER_MENU_ACTIVE_CLASS } from "../../user-menu-const.js";
import { USER_MENU_AUTH_BTN_SELECTOR } from "../../user-menu-const.js";
import { USER_MENU_AUTH_SIGN_IN_CLASS } from "../../user-menu-const.js";
import { USER_MENU_AUTH_SIGN_UP_CLASS } from "../../user-menu-const.js";
import { USER_MENU_AUTH_TRACK_SELECTOR } from "../../user-menu-const.js";
import { USER_MENU_AUTH_VIEW_SIGN_IN } from "../../user-menu-const.js";
import { USER_MENU_HIDDEN_CLASS } from "../../user-menu-const.js";
import { USER_MENU_SIGN_IN_INPUT_SELECTOR } from "../../user-menu-const.js";
import { USER_MENU_SIGN_IN_VIEW_SELECTOR } from "../../user-menu-const.js";
import { USER_MENU_SIGN_UP_VIEW_SELECTOR } from "../../user-menu-const.js";
import { USER_MENU_THEME_BTN_SELECTOR } from "../../user-menu-const.js";
import { USER_MENU_THEME_DARK_CLASS } from "../../user-menu-const.js";
import { USER_MENU_THEME_LIGHT_CLASS } from "../../user-menu-const.js";
import { USER_MENU_THEME_TRACK_SELECTOR } from "../../user-menu-const.js";

/** Verifies an auth number and runs the sign-in animation sequence. */
async function userMenuActionAuthSignIn(input) {
  if (userMenuStateGet().isSignInRunning) {
    return false;
  }

  const sanitized = authSanitizeNumber(input);

  if (sanitized.length !== AUTH_NUMBER_LENGTH) {
    return false;
  }

  let isSuccess = false;

  try {
    const result = await authApiVerify(sanitized);

    if (result?.success === true) {
      await authStorageSet(sanitized);
      isSuccess = true;
    }
  } catch {
    isSuccess = false;
  }

  return userMenuAnimationAuthSignIn(isSuccess, async (resultIsSuccess) => {
    if (resultIsSuccess) {
      await authChromeApply({ applyExtensionChrome: false });

      const signInInput = document.querySelector(USER_MENU_SIGN_IN_INPUT_SELECTOR);

      if (signInInput) {
        signInInput.value = "";
      }

      const theme = themeGet();

      document.querySelectorAll(USER_MENU_THEME_BTN_SELECTOR).forEach((button) => {
        button.classList.toggle(USER_MENU_ACTIVE_CLASS, button.dataset.theme === theme);
      });

      const themeTrack = document.querySelector(USER_MENU_THEME_TRACK_SELECTOR);
      const isDark = theme === THEME_DARK;

      themeTrack?.classList.toggle(USER_MENU_THEME_LIGHT_CLASS, !isDark);
      themeTrack?.classList.toggle(USER_MENU_THEME_DARK_CLASS, isDark);

      return {
        afterFades: async () => {
          await authChromeApply();
          const authNumber = await authStorageGet();
          const accounts = authNumber ? await dataHandleSync(authNumber) : [];
          await codesLoadStart(accounts, { playIntro: false });
          bodyAnimationFinish();
        },
      };
    }

    const signInView = document.querySelector(USER_MENU_SIGN_IN_VIEW_SELECTOR);
    const signUpView = document.querySelector(USER_MENU_SIGN_UP_VIEW_SELECTOR);

    signInView?.classList.remove(USER_MENU_HIDDEN_CLASS);
    signUpView?.classList.add(USER_MENU_HIDDEN_CLASS);

    document.querySelectorAll(USER_MENU_AUTH_BTN_SELECTOR).forEach((button) => {
      button.classList.toggle(
        USER_MENU_ACTIVE_CLASS,
        button.dataset.view === USER_MENU_AUTH_VIEW_SIGN_IN,
      );
    });

    const authTrack = document.querySelector(USER_MENU_AUTH_TRACK_SELECTOR);

    authTrack?.classList.add(USER_MENU_AUTH_SIGN_IN_CLASS);
    authTrack?.classList.remove(USER_MENU_AUTH_SIGN_UP_CLASS);
    return [];
  });
}

export { userMenuActionAuthSignIn };
