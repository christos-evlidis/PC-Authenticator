import { USER_MENU_AUTH_VIEW_SIGN_IN } from "../constants.js";
import { USER_MENU_AUTH_VIEW_SIGN_UP } from "../constants.js";
import { userMenuAuthViewApply } from "../render/auth.js";
import { userMenuStateGet } from "../state.js";
import { userMenuStateSet } from "../state.js";
import { userMenuAuthSwitchAnimation } from "../animations/auth-switch-animation.js";

// Switches the signed-out user menu between sign-in and sign-up panels.
export function userMenuAuthSwitch(authView) {
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
  userMenuAuthViewApply(nextView);
  void userMenuAuthSwitchAnimation(nextView);
}
