import { authApiCreate } from "../services/auth/auth-index.js";
import { authApiVerify } from "../services/auth/auth-index.js";
import { authSanitizeNumber } from "../services/auth/auth-index.js";
import { authStorageClear } from "../services/auth/auth-index.js";
import { authStorageSet } from "../services/auth/auth-index.js";
import { dataActionAddQr } from "../services/data/data-index.js";
import { dataHandleSync } from "../services/data/data-index.js";
import { dataStoragePurge } from "../services/data/data-index.js";
import { themeActionClear } from "../services/theme/theme-index.js";
import { themeActionApply } from "../services/theme/theme-index.js";
import { THEME_DARK_KEY, THEME_LIGHT_KEY } from "../services/theme/theme-index.js";
import { appSessionRefresh } from "./app.session.js";
import { appStateGet } from "./app.state.js";
import { appShellThemeGet } from "./app.shell.js";
import { scanStart, scanCancel } from "../services/scan/scan-index.js";

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

    return true;
  } catch {}

  return false;
}

/**
 * Applies the specified theme.
 */
function appActionThemeApply(theme) {
  themeActionApply(theme);
}

/**
 * Returns the current authenticated account key from app state.
 */
function appActionGetAuth() {
  return appStateGet().authKey;
}

/**
 * Returns the currently active theme.
 */
function appActionGetTheme() {
  return appShellThemeGet();
}

/**
 * Initiates the scan process.
 */
async function appActionScanStart() {
  return await scanStart();
}

/**
 * Cancels the ongoing scan process.
 */
async function appActionScanCancel() {
  return await scanCancel();
}

export { appActionAddQr };
export { appActionSignIn };
export { appActionSignOut };
export { appActionSignUp };
export { appActionGetAuth };
export { appActionGetTheme };
export { appActionThemeApply };
export { appActionScanStart };
export { appActionScanCancel };
export { THEME_DARK_KEY, THEME_LIGHT_KEY };


