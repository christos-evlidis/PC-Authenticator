import { authCreate } from "../../../accounts/account-index.js";
import { authNumberSet } from "../../../accounts/account-index.js";
import { authSanitize } from "../../../accounts/account-index.js";
import { AUTH_NUMBER_LENGTH } from "../../../accounts/account-index.js";
import { userMenuStateGet } from "../state.js";
import { userMenuSignUpAnimation } from "../animations/sign-up.js";

// Creates a new account, stores it locally, and runs the shared auth result animation.
export async function userMenuSignUp() {
  if (userMenuStateGet().isSignInRunning) {
    return false;
  }

  let isSuccess = false;

  try {
    const accountNumber = await authCreate();
    const sanitized = authSanitize(accountNumber);

    if (sanitized.length === AUTH_NUMBER_LENGTH) {
      await authNumberSet(sanitized);
      isSuccess = true;
    }
  } catch {
    isSuccess = false;
  }

  return userMenuSignUpAnimation(isSuccess);
}
