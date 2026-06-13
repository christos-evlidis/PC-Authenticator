import { authApiCreate } from "../services/auth/auth-index.js";
import { authApiVerify } from "../services/auth/auth-index.js";
import { authSanitizeNumber } from "../services/auth/auth-index.js";
import { authStorageClear } from "../services/auth/auth-index.js";
import { authStorageSet } from "../services/auth/auth-index.js";

import { dataStoragePurge } from "../services/data/data-index.js";
import { themeActionApply } from "../services/theme/theme-index.js";
import { themeStateGet } from "../services/theme/state/get.js";
import { appStateGet } from "./app.state.js";

/**
 * Initiates the sign-in process with the provided account number.
 */
async function appSignIn(input) {
  try {
    const authKey = authSanitizeNumber(input);
    const result = await authApiVerify(authKey);
    if (result) {
      await authStorageSet(authKey);
      return true;
    }
  } catch {}
  return false;
}

/**
 * Initiates the sign-up process to create a new account.
 */
async function appSignUp() {
  try {
    const result = await authApiCreate();
    if (result?.success === true) {
      const authKey = result.account_number;
      await authStorageSet(authKey);
      return true;
    }
  } catch {}
  return false;
}

/**
 * Initiates the sign-out process, clearing all local data.
 */
async function appSignOut() {
  try {
    await authStorageClear();
    await dataStoragePurge();
    return true;
  } catch {}
  return false;
}

/**
 * Applies the specified theme.
 */
function appThemeApply(theme) {
  try {
    themeActionApply(theme);
  } catch {}
}

/**
 * Retrieves the active account authentication key from state.
 */
function appAuthGet() {
  try {
    return appStateGet().authKey;
  } catch {}
  return null;
}

/**
 * Retrieves the active application theme key.
 */
function appThemeGet() {
  try {
    return themeStateGet();
  } catch {}
  return null;
}

export { appSignIn };
export { appSignOut };
export { appSignUp };
export { appAuthGet };
export { appThemeApply };
export { appThemeGet };
