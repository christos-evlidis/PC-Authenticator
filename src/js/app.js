import { authApiVerify } from "./accounts/accounts-index.js";
import { authStorageGet } from "./accounts/accounts-index.js";
import { dataHandleSync } from "./accounts/accounts-index.js";
import { initSectionModules } from "./sections/sections-index.js";
import { codesLoadStart } from "./sections/shell/codes/codes-index.js";
import { loadAnimationStart } from "./sections/shell/sequences/sequences-index.js";
import { qrSetupActionInstant } from "./sections/overlay/qr-code-setup/qr-code-setup-index.js";
import { qrSetupAnimationResumePrepare } from "./sections/overlay/qr-code-setup/qr-code-setup-index.js";
import { qrSetupHandlePending } from "./sections/overlay/qr-code-setup/qr-code-setup-index.js";
import { qrSetupHandleResume } from "./sections/overlay/qr-code-setup/qr-code-setup-index.js";
import { authChromeApply } from "./utils/utility-auth.js";
import { themeChromeStorageSync } from "./utils/utility-theme.js";

void startExtension();

/** Applies theme, restores auth/data, then plays the load intro. */
async function startExtension() {
  await themeChromeStorageSync();
  initSectionModules();

  const resume = await qrSetupHandleResume();

  if (resume) {
    const authNumber = await authStorageGet();
    const accounts = authNumber ? await dataHandleSync(authNumber) : [];

    await loadAnimationStart(true, { skipIntro: true });
    await codesLoadStart(accounts, { playIntro: false });
    qrSetupActionInstant();
    qrSetupAnimationResumePrepare();
    await qrSetupHandlePending();
    return;
  }

  let isSignedIn = false;
  let accounts = [];

  try {
    const authNumber = await authStorageGet();

    if (!authNumber) {
      await authChromeApply({ authNumber: null, isSignedIn: false });
    } else {
      const verifyResult = await authApiVerify(authNumber);

      if (verifyResult?.success !== true) {
        throw new Error("Account verification failed");
      }

      accounts = await dataHandleSync(authNumber);
      const hasAccounts = accounts.length > 0;

      await authChromeApply({ authNumber, isSignedIn: true, hasAccounts });
      isSignedIn = true;
    }
  } catch {
    return;
  }

  await loadAnimationStart(isSignedIn);

  if (isSignedIn) {
    await codesLoadStart(accounts, { playIntro: true });
  }
}
