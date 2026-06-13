import { authApiCreate } from "../services/auth/auth-index.js";
import { authApiVerify } from "../services/auth/auth-index.js";
import { authSanitizeNumber } from "../services/auth/auth-index.js";
import { authStorageClear } from "../services/auth/auth-index.js";
import { authStorageSet } from "../services/auth/auth-index.js";

import { dataStoragePurge } from "../services/data/data-index.js";
import { themeActionApply, THEME_DARK_KEY, THEME_LIGHT_KEY } from "../services/theme/theme-index.js";
import { appStateGet } from "./app.state.js";

/**
 * Initiates the sign-in process with the provided account number.
 */
async function appSignIn(input) {
  const authKey = authSanitizeNumber(input);
  try {
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
  themeActionApply(theme);
}

/**
 * Retrieves the active account authentication key from state.
 */
function appAuthGet() {
  return appStateGet().authKey;
}

export { appSignIn };
export { appSignOut };
export { appSignUp };
export { appAuthGet };
export { appThemeApply };
export { THEME_DARK_KEY, THEME_LIGHT_KEY };
