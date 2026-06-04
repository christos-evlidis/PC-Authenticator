import { accountsClear } from "../../../accounts/account-index.js";
import { userMenuAccountClear } from "../user-menu-storage.js";
import { userMenuStateGet } from "../user-menu-state.js";
import { userMenuSignOutAnimation } from "../user-menu-animations/user-menu-sign-out-animation.js";

/** Clears stored credentials and runs the logout auth sequence animation. */
export async function userMenuSignOut() {
  if (userMenuStateGet().isSignInRunning) {
    return false;
  }

  await userMenuAccountClear();
  await accountsClear();

  return userMenuSignOutAnimation();
}
