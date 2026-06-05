import { authNumberVerifyCacheClear } from "../../../utils/utility-auth.js";
import { authNumberClear } from "../../../accounts/accounts-index.js";
import { dataStorageClearAll } from "../../../accounts/accounts-index.js";
import { userMenuStateGet } from "../state.js";
import { userMenuSignOutAnimation } from "../animations/sign-out.js";

/** Clears stored credentials and runs the logout auth sequence animation. */
export async function userMenuSignOut() {
  if (userMenuStateGet().isSignInRunning) {
    return false;
  }

  await authNumberClear();
  authNumberVerifyCacheClear();
  await dataStorageClearAll();

  return userMenuSignOutAnimation();
}
