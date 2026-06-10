import { authChromeApply } from "../../../../../utils/utility-auth.js";
import { authStorageClear } from "../../../../../accounts/auth/storage/clear.js";
import { bodyAnimationFinish } from "../../../../shell/body/animation/finish.js";
import { dataStoragePurge } from "../../../../../accounts/data/storage/purge.js";
import { userMenuAnimationAuthSignOut } from "../../animation/auth/sign-out.js";
import { userMenuStateGet } from "../../state/get.js";

import { USER_MENU_ACTIVE_CLASS } from "../../constants.js";
import { USER_MENU_AUTH_BTN_SELECTOR } from "../../constants.js";
import { USER_MENU_AUTH_SIGN_IN_CLASS } from "../../constants.js";
import { USER_MENU_AUTH_SIGN_UP_CLASS } from "../../constants.js";
import { USER_MENU_AUTH_TRACK_SELECTOR } from "../../constants.js";
import { USER_MENU_AUTH_VIEW_SIGN_IN } from "../../constants.js";
import { USER_MENU_HIDDEN_CLASS } from "../../constants.js";
import { USER_MENU_SIGN_IN_INPUT_SELECTOR } from "../../constants.js";
import { USER_MENU_SIGN_IN_VIEW_SELECTOR } from "../../constants.js";
import { USER_MENU_SIGN_UP_VIEW_SELECTOR } from "../../constants.js";

async function userMenuActionsAuthSignOut() {
  if (userMenuStateGet().isSignInRunning) {
    return false;
  }

  await authStorageClear();
  await dataStoragePurge();

  return userMenuAnimationAuthSignOut(async () => {
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

    const signInInput = document.querySelector(USER_MENU_SIGN_IN_INPUT_SELECTOR);

    if (signInInput) {
      signInInput.value = "";
    }

    await authChromeApply();
    bodyAnimationFinish();
    return [];
  });
}

export { userMenuActionsAuthSignOut };
