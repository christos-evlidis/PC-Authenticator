import { authNumberSet } from "../../../accounts/account-index.js";
import { authSanitize } from "../../../accounts/account-index.js";
import { authVerify } from "../../../accounts/account-index.js";
import { AUTH_NUMBER_LENGTH } from "../../../accounts/account-index.js";
import { userMenuStateGet } from "../state.js";
import { userMenuSignInAnimation } from "../animations/sign-in.js";

// Verifies credentials once at submit time, stores the account, and animates the result.
export async function userMenuSignIn(accountNumber) {
  if (userMenuStateGet().isSignInRunning) {
    return false;
  }

  const sanitized = authSanitize(accountNumber);

  if (sanitized.length !== AUTH_NUMBER_LENGTH) {
    return false;
  }

  let isSuccess = false;

  try {
    const result = await authVerify(sanitized);

    if (result?.success === true) {
      await authNumberSet(sanitized);
      isSuccess = true;
    }
  } catch {
    isSuccess = false;
  }

  return userMenuSignInAnimation(isSuccess);
}
