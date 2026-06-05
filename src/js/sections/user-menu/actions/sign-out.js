import { accountNumberClear } from "../../../accounts/account-index.js";
import { dataStorageClearAll } from "../../../accounts/account-index.js";
import { userMenuStateGet } from "../state.js";
import { userMenuSignOutAnimation } from "../animations/sign-out.js";

/** Clears stored credentials and runs the logout auth sequence animation. */
export async function userMenuSignOut() {
  if (userMenuStateGet().isSignInRunning) {
    return false;
  }

  await accountNumberClear();
  await dataStorageClearAll();

  return userMenuSignOutAnimation();
}
