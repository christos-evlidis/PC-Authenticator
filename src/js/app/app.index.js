import { authApiVerify, authStorageGet } from "../services/auth/auth-index.js";
import { dataHandleSync } from "../services/data/data-index.js";
import { initSectionModules } from "../sections/sections-index.js";
import { loadAnimationStart } from "../services/sequences/sequences-index.js";
import { themeInit } from "../services/theme/theme-index.js";
import { appSessionRefresh } from "./app.session.js";
import { appStateGet } from "./app.state.js";
import { appScanCheck, appScanResume } from "./app.scan.js";

/**
 * Initializes and starts the application.
 * @returns {Promise<void>} Resolves when application has initialized.
 */
async function appInit() {
  try {
    themeInit();
    initSectionModules();
    const authKey = await authStorageGet();
    if (authKey) {
      const request = await authApiVerify(authKey);
      if (request) {
        await dataHandleSync(authKey);
        await appSessionRefresh();
      } else {
        throw new Error("Account Verification Failed");
      }
    } else {
      await appSessionRefresh();
    }
    const result = await appScanCheck();
    if (result) {
      await appScanResume();
      return;
    }
  } catch {
    return;
  }
  await loadAnimationStart(appStateGet().stateAuth);
}

void appInit();
