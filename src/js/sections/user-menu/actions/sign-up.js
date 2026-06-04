import { accountCreate } from "../../../accounts/account-index.js";
import { accountNumberSet } from "../../../accounts/account-index.js";
import { accountNumberSanitize } from "../../../accounts/account-index.js";
import { ACCOUNT_NUMBER_LENGTH } from "../../../accounts/account-index.js";
import { userMenuStateGet } from "../state.js";
import { userMenuSignUpAnimation } from "../animations/sign-up.js";

// Creates a new account, stores it locally, and runs the shared auth result animation.
export async function userMenuSignUp() {
  if (userMenuStateGet().isSignInRunning) {
    return false;
  }

  let isSuccess = false;

  try {
    const accountNumber = await accountCreate();
    const sanitized = accountNumberSanitize(accountNumber);

    if (sanitized.length === ACCOUNT_NUMBER_LENGTH) {
      await accountNumberSet(sanitized);
      isSuccess = true;
    }
  } catch {
    isSuccess = false;
  }

  return userMenuSignUpAnimation(isSuccess);
}
