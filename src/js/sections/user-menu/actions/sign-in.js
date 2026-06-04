import { accountNumberSet } from "../../../accounts/account-index.js";
import { accountNumberSanitize } from "../../../accounts/account-index.js";
import { accountVerify } from "../../../accounts/account-index.js";
import { ACCOUNT_NUMBER_LENGTH } from "../../../accounts/account-index.js";
import { userMenuStateGet } from "../state.js";
import { userMenuSignInAnimation } from "../animations/sign-in.js";

// Verifies credentials once at submit time, stores the account, and animates the result.
export async function userMenuSignIn(accountNumber) {
  if (userMenuStateGet().isSignInRunning) {
    return false;
  }

  const sanitized = accountNumberSanitize(accountNumber);

  if (sanitized.length !== ACCOUNT_NUMBER_LENGTH) {
    return false;
  }

  let isSuccess = false;

  try {
    const result = await accountVerify(sanitized);

    if (result?.success === true) {
      await accountNumberSet(sanitized);
      isSuccess = true;
    }
  } catch {
    isSuccess = false;
  }

  return userMenuSignInAnimation(isSuccess);
}
