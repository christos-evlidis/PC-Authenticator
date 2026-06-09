import { authStorageSet } from "../../../accounts/accounts-index.js";
import { authSanitizeNumber } from "../../../accounts/accounts-index.js";
import { authApiVerify } from "../../../accounts/accounts-index.js";
import { userMenuStateGet } from "../state.js";
import { userMenuAuthSignInResultApply } from "./auth-result.js";
import { userMenuSignInAnimation } from "../animations/sign-in.js";

import { AUTH_NUMBER_LENGTH } from "../../../accounts/accounts-index.js";

/** Verifies credentials, stores the auth number, and animates the result. */
async function userMenuSignIn(input) {
  if (userMenuStateGet().isSignInRunning) {
    return false;
  }

  const sanitized = authSanitizeNumber(input);

  if (sanitized.length !== AUTH_NUMBER_LENGTH) {
    return false;
  }

  let isSuccess = false;

  try {
    const result = await authApiVerify(sanitized);

    if (result?.success === true) {
      await authStorageSet(sanitized);
      isSuccess = true;
    }
  } catch {
    isSuccess = false;
  }

  return userMenuSignInAnimation(isSuccess, userMenuAuthSignInResultApply);
}

export { userMenuSignIn };
