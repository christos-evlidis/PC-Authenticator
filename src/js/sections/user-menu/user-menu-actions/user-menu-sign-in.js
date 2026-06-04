import { accountVerify } from "../../../accounts/account-index.js";
import { USER_MENU_ACCOUNT_NUMBER_LENGTH } from "../user-menu-constants.js";
import { userMenuAccountSet } from "../user-menu-storage.js";
import { userMenuStateGet } from "../user-menu-state.js";
import { userMenuAccountSanitize } from "../user-menu-sanitize.js";
import { userMenuSignInAnimation } from "../user-menu-animations/user-menu-sign-in-animation.js";

// Verifies credentials once at submit time, stores the account, and animates the result.
export async function userMenuSignIn(accountNumber) {
  if (userMenuStateGet().isSignInRunning) {
    return false;
  }

  const sanitized = userMenuAccountSanitize(accountNumber);

  if (sanitized.length !== USER_MENU_ACCOUNT_NUMBER_LENGTH) {
    return false;
  }

  let isSuccess = false;

  try {
    const result = await accountVerify(sanitized);

    if (result?.success === true) {
      await userMenuAccountSet(sanitized);
      isSuccess = true;
    }
  } catch {
    isSuccess = false;
  }

  return userMenuSignInAnimation(isSuccess);
}
