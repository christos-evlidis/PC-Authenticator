import { userMenuStateGet } from "../state.js";
import { userMenuStateSet } from "../state.js";
import { userMenuAuthSwitchAnimation } from "../animations/auth-switch.js";

import { USER_MENU_ACTIVE_CLASS } from "../constants.js";
import { USER_MENU_AUTH_BTN_SELECTOR } from "../constants.js";
import { USER_MENU_AUTH_VIEW_SIGN_IN } from "../constants.js";
import { USER_MENU_AUTH_VIEW_SIGN_UP } from "../constants.js";
import { USER_MENU_HIDDEN_CLASS } from "../constants.js";
import { USER_MENU_SIGN_IN_VIEW_SELECTOR } from "../constants.js";
import { USER_MENU_SIGN_UP_VIEW_SELECTOR } from "../constants.js";

/** Switches the signed-out user menu between sign-in and sign-up panels. */
function userMenuAuthSwitch(authView) {
  if (userMenuStateGet().isSignInRunning) {
    return;
  }

  const nextView =
    authView === USER_MENU_AUTH_VIEW_SIGN_UP
      ? USER_MENU_AUTH_VIEW_SIGN_UP
      : USER_MENU_AUTH_VIEW_SIGN_IN;

  if (userMenuStateGet().authView === nextView) {
    return;
  }

  userMenuStateSet({ authView: nextView });

  const signInView = document.querySelector(USER_MENU_SIGN_IN_VIEW_SELECTOR);
  const signUpView = document.querySelector(USER_MENU_SIGN_UP_VIEW_SELECTOR);
  const isSignUp = nextView === USER_MENU_AUTH_VIEW_SIGN_UP;

  signInView?.classList.toggle(USER_MENU_HIDDEN_CLASS, isSignUp);
  signUpView?.classList.toggle(USER_MENU_HIDDEN_CLASS, !isSignUp);

  document.querySelectorAll(USER_MENU_AUTH_BTN_SELECTOR).forEach((button) => {
    button.classList.toggle(
      USER_MENU_ACTIVE_CLASS,
      button.dataset.view === nextView,
    );
  });

  void userMenuAuthSwitchAnimation(nextView);
}

export { userMenuAuthSwitch };
