import { authNumberSet } from "../../../accounts/accounts-index.js";
import { authSanitize } from "../../../accounts/accounts-index.js";
import { authVerify } from "../../../accounts/accounts-index.js";
import { AUTH_NUMBER_LENGTH } from "../../../accounts/accounts-index.js";
import { authNumberVerifyCacheClear } from "../../../utils/utility-auth.js";
import { userMenuStateGet } from "../state.js";
import { userMenuSignInAnimation } from "../animations/sign-in.js";

/** Verifies credentials, stores the auth number, and animates the result. */
export async function userMenuSignIn(input) {
  if (userMenuStateGet().isSignInRunning) {
    return false;
  }

  const sanitized = authSanitize(input);

  if (sanitized.length !== AUTH_NUMBER_LENGTH) {
    return false;
  }

  let isSuccess = false;

  try {
    const result = await authVerify(sanitized);

    if (result?.success === true) {
      await authNumberSet(sanitized);
      authNumberVerifyCacheClear();
      isSuccess = true;
    }
  } catch {
    isSuccess = false;
  }

  return userMenuSignInAnimation(isSuccess);
}
