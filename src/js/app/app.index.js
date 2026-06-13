import { authApiVerify, authStorageGet } from "../services/auth/auth-index.js";
import { dataHandleSync } from "../services/data/data-index.js";
import { initSectionModules } from "../sections/sections-index.js";
import { INTRO_ACTIVE_CLASS, INTRO_ROOT_SELECTOR } from "../const/const.sequences.js";
import { loadAnimationStart } from "../services/sequences/sequences-index.js";
import { themeActionApply, themeStorageGet, THEME_LIGHT_KEY } from "../services/theme/theme-index.js";
import { appSessionRefresh } from "./app.session.js";
import { appStateGet } from "./app.state.js";

/**
 * Initializes and starts the application.
 */
async function appInit() {
  //theme handler
  if (!themeStorageGet()) {
    themeActionApply(THEME_LIGHT_KEY, { instant: true });
  } else {
    themeActionApply(themeStorageGet(), { instant: true });
  }

  //section handler
  initSectionModules();

  //auth handler
  try {
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
  } catch {
    return;
  }

  //intro sequence handler
  document.querySelector(INTRO_ROOT_SELECTOR)?.classList.add(INTRO_ACTIVE_CLASS);
  await loadAnimationStart(appStateGet().stateAuth);
}

void appInit();
