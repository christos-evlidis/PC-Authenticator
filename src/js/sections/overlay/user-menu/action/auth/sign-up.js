import { authApiCreate } from "../../../../../accounts/auth/api/create.js";
import { authChromeApply } from "../../../../../utils/utility-auth.js";
import { authSanitizeNumber } from "../../../../../accounts/auth/sanitize/number.js";
import { authStorageSet } from "../../../../../accounts/auth/storage/set.js";
import { bodyAnimationFinish } from "../../../../shell/body/animation/finish.js";
import { themeGet } from "../../../../../utils/utility-theme.js";
import { userMenuAnimationAuthSignUp } from "../../animation/auth/sign-up.js";
import { userMenuStateGet } from "../../state/get.js";

import { AUTH_NUMBER_LENGTH } from "../../../../../accounts/constants.js";
import { THEME_DARK } from "../../../../../utils/utility-theme.js";
import { USER_MENU_ACTIVE_CLASS } from "../../constants.js";
import { USER_MENU_AUTH_BTN_SELECTOR } from "../../constants.js";
import { USER_MENU_AUTH_SIGN_IN_CLASS } from "../../constants.js";
import { USER_MENU_AUTH_SIGN_UP_CLASS } from "../../constants.js";
import { USER_MENU_AUTH_TRACK_SELECTOR } from "../../constants.js";
import { USER_MENU_AUTH_VIEW_SIGN_UP } from "../../constants.js";
import { USER_MENU_HIDDEN_CLASS } from "../../constants.js";
import { USER_MENU_SIGN_IN_INPUT_SELECTOR } from "../../constants.js";
import { USER_MENU_SIGN_IN_VIEW_SELECTOR } from "../../constants.js";
import { USER_MENU_SIGN_UP_VIEW_SELECTOR } from "../../constants.js";
import { USER_MENU_THEME_BTN_SELECTOR } from "../../constants.js";
import { USER_MENU_THEME_DARK_CLASS } from "../../constants.js";
import { USER_MENU_THEME_LIGHT_CLASS } from "../../constants.js";
import { USER_MENU_THEME_TRACK_SELECTOR } from "../../constants.js";

async function userMenuActionsAuthSignUp() {
  if (userMenuStateGet().isSignInRunning) {
    return false;
  }

  let isSuccess = false;

  try {
    const authNumber = await authApiCreate();
    const sanitized = authSanitizeNumber(authNumber);

    if (sanitized.length === AUTH_NUMBER_LENGTH) {
      await authStorageSet(sanitized);
      isSuccess = true;
    }
  } catch {
    isSuccess = false;
  }

  return userMenuAnimationAuthSignUp(isSuccess, async (resultIsSuccess) => {
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
          bodyAnimationFinish();
        },
      };
    }

    const signInView = document.querySelector(USER_MENU_SIGN_IN_VIEW_SELECTOR);
    const signUpView = document.querySelector(USER_MENU_SIGN_UP_VIEW_SELECTOR);

    signInView?.classList.add(USER_MENU_HIDDEN_CLASS);
    signUpView?.classList.remove(USER_MENU_HIDDEN_CLASS);

    document.querySelectorAll(USER_MENU_AUTH_BTN_SELECTOR).forEach((button) => {
      button.classList.toggle(
        USER_MENU_ACTIVE_CLASS,
        button.dataset.view === USER_MENU_AUTH_VIEW_SIGN_UP,
      );
    });

    const authTrack = document.querySelector(USER_MENU_AUTH_TRACK_SELECTOR);

    authTrack?.classList.remove(USER_MENU_AUTH_SIGN_IN_CLASS);
    authTrack?.classList.add(USER_MENU_AUTH_SIGN_UP_CLASS);
    return [];
  });
}

export { userMenuActionsAuthSignUp };
