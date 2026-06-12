import { authApiCreate } from "../services/auth/auth-index.js";
import { authApiVerify } from "../services/auth/auth-index.js";
import { authSanitizeNumber } from "../services/auth/auth-index.js";
import { authStorageClear } from "../services/auth/auth-index.js";
import { authStorageSet } from "../services/auth/auth-index.js";
import { dataActionAddQr } from "../services/data/data-index.js";
import { dataHandleSync } from "../services/data/data-index.js";
import { dataStoragePurge } from "../services/data/data-index.js";
import { themeActionClear } from "../services/theme/theme-index.js";
import { appSessionRefresh } from "./app.session.js";
import { appStateGet } from "./app.state.js";

/**
 * Adds a new account from a scanned QR code URI.
 */
async function appActionAddQr(uri) {
  const authKey = appStateGet().authKey;

  const account = await dataActionAddQr(authKey, uri);
  
  if (account) {
    await dataHandleSync(authKey);
    
    await appSessionRefresh();
  }
  
  return account;
}

/**
 * Initiates the sign-in process with the provided account number.
 */
async function appActionSignIn(input) {
  const authKey = authSanitizeNumber(input);

  try {
    const result = await authApiVerify(authKey);

    if (result?.success === true) {
      await authStorageSet(authKey);

      return true;
    }
  } catch {}
  
  return false;
}

/**
 * Initiates the sign-up process to create a new account.
 */
async function appActionSignUp() {
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
async function appActionSignOut() {
  try {
    await authStorageClear();

    await dataStoragePurge();

    await themeActionClear();

    return true;
  } catch {}

  return false;
}

export { appActionAddQr };
export { appActionSignIn };
export { appActionSignOut };
export { appActionSignUp };
