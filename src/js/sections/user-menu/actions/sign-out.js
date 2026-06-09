import { authStorageClear } from "../../../accounts/accounts-index.js";
import { dataStoragePurge } from "../../../accounts/accounts-index.js";
import { userMenuStateGet } from "../state.js";
import { userMenuAuthSignOutResultApply } from "./auth-result.js";
import { userMenuSignOutAnimation } from "../animations/sign-out.js";

/** Clears stored credentials and runs the logout auth sequence animation. */
async function userMenuSignOut() {
  if (userMenuStateGet().isSignInRunning) {
    return false;
  }

  await authStorageClear();
  await dataStoragePurge();

  return userMenuSignOutAnimation(userMenuAuthSignOutResultApply);
}

export { userMenuSignOut };
