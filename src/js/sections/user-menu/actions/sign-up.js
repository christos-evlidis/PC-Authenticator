import { accountCreate } from "../../../accounts/account-index.js";
import { USER_MENU_ACCOUNT_NUMBER_LENGTH } from "../constants.js";
import { userMenuAccountSet } from "../storage.js";
import { userMenuStateGet } from "../state.js";
import { userMenuAccountSanitize } from "../sanitize.js";
import { userMenuSignUpAnimation } from "../animations/sign-up.js";

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
