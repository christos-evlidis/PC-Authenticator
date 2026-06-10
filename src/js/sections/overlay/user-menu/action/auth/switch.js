import { userMenuAnimationAuthSwitch } from "../../animation/auth/switch.js";
import { userMenuStateGet } from "../../state/get.js";
import { userMenuStateSet } from "../../state/set.js";

import { USER_MENU_ACTIVE_CLASS } from "../../user-menu-const.js";
import { USER_MENU_AUTH_BTN_SELECTOR } from "../../user-menu-const.js";
import { USER_MENU_AUTH_VIEW_SIGN_IN } from "../../user-menu-const.js";
import { USER_MENU_AUTH_VIEW_SIGN_UP } from "../../user-menu-const.js";
import { USER_MENU_HIDDEN_CLASS } from "../../user-menu-const.js";
import { USER_MENU_SIGN_IN_VIEW_SELECTOR } from "../../user-menu-const.js";
import { USER_MENU_SIGN_UP_VIEW_SELECTOR } from "../../user-menu-const.js";

function userMenuActionsAuthSwitch(authView) {
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

  void userMenuAnimationAuthSwitch(nextView);
}

export { userMenuActionsAuthSwitch };
