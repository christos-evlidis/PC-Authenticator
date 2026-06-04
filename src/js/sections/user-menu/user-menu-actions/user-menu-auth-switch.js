import { USER_MENU_AUTH_VIEW_SIGN_IN } from "../user-menu-constants.js";
import { USER_MENU_AUTH_VIEW_SIGN_UP } from "../user-menu-constants.js";
import { userMenuAuthViewApply } from "../user-menu-render/user-menu-auth.js";
import { userMenuStateGet } from "../user-menu-state.js";
import { userMenuStateSet } from "../user-menu-state.js";
import { userMenuAuthSwitchAnimation } from "../user-menu-animations/user-menu-auth-switch-animation.js";

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
