import { accountVerify } from "../../../accounts/account-index.js";
import { USER_MENU_ACCOUNT_NUMBER_LENGTH } from "../constants.js";
import { userMenuAccountSet } from "../storage.js";
import { userMenuStateGet } from "../state.js";
import { userMenuAccountSanitize } from "../sanitize.js";
import { userMenuSignInAnimation } from "../animations/sign-in.js";

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
