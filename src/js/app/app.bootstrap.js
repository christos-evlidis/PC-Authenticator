import { authApiVerify, authStorageGet } from "../services/auth/auth-index.js";
import { dataHandleSync } from "../services/data/data-index.js";
import { initSectionModules } from "../sections/sections-index.js";
import { INTRO_ACTIVE_CLASS } from "../services/sequences/sequences-const.js";
import { INTRO_ROOT_SELECTOR } from "../services/sequences/sequences-const.js";
import { loadAnimationStart } from "../services/sequences/sequences-index.js";
import { appResumeCheck } from "./app.resume.js";
import { themeActionApply, themeStorageGet } from "../services/theme/theme-index.js";
import { appSessionRefresh } from "./app.session.js";

async function appBootstrapStart() {
  themeActionApply(themeStorageGet(), { instant: true });
  initSectionModules();

  const isResuming = await appResumeCheck();

  if (isResuming) {
    return;
  }

  document.querySelector(INTRO_ROOT_SELECTOR)?.classList.add(INTRO_ACTIVE_CLASS);

  let isSignedIn = false;
  let accounts = [];

  try {
    const authNumber = await authStorageGet();

    if (!authNumber) {
      await appSessionRefresh();
    } else {
      const verifyResult = await authApiVerify(authNumber);

      if (verifyResult?.success !== true) {
        throw new Error("Account verification failed");
      }

      accounts = await dataHandleSync(authNumber);
      const hasAccounts = accounts.length > 0;

      await appSessionRefresh();
      isSignedIn = true;
    }
  } catch {
    return;
  }

  await loadAnimationStart(isSignedIn);

  if (isSignedIn) {
    await appSessionRefresh();
  }
}

export { appBootstrapStart };
