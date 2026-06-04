import { accountCreate } from "../../../accounts/account-index.js";
import { USER_MENU_ACCOUNT_NUMBER_LENGTH } from "../user-menu-constants.js";
import { userMenuAccountSet } from "../user-menu-storage.js";
import { userMenuStateGet } from "../user-menu-state.js";
import { userMenuAccountSanitize } from "../user-menu-sanitize.js";
import { userMenuSignUpAnimation } from "../user-menu-animations/user-menu-sign-up-animation.js";

// Creates a new account, stores it locally, and runs the shared auth result animation.
export async function userMenuSignUp() {
  if (userMenuStateGet().isSignInRunning) {
    return false;
  }

  let isSuccess = false;

  try {
    const accountNumber = await accountCreate();
    const sanitized = userMenuAccountSanitize(accountNumber);

    if (sanitized.length === USER_MENU_ACCOUNT_NUMBER_LENGTH) {
      await userMenuAccountSet(sanitized);
      isSuccess = true;
    }
  } catch {
    isSuccess = false;
  }

  return userMenuSignUpAnimation(isSuccess);
}
