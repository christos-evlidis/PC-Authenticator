import { authCreate } from "../../../accounts/accounts-index.js";
import { authNumberSet } from "../../../accounts/accounts-index.js";
import { authSanitize } from "../../../accounts/accounts-index.js";
import { userMenuStateGet } from "../state.js";
import { userMenuAuthSignUpResultApply } from "./auth-result.js";
import { userMenuSignUpAnimation } from "../animations/sign-up.js";

import { AUTH_NUMBER_LENGTH } from "../../../accounts/accounts-index.js";

/** Creates a new account, stores it locally, and runs the auth result animation. */
async function userMenuSignUp() {
  if (userMenuStateGet().isSignInRunning) {
    return false;
  }

  let isSuccess = false;

  try {
    const authNumber = await authCreate();
    const sanitized = authSanitize(authNumber);

    if (sanitized.length === AUTH_NUMBER_LENGTH) {
      await authNumberSet(sanitized);
      isSuccess = true;
    }
  } catch {
    isSuccess = false;
  }

  return userMenuSignUpAnimation(isSuccess, userMenuAuthSignUpResultApply);
}

export { userMenuSignUp };
