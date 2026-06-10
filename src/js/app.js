import { authApiVerify } from "./accounts/auth/api/verify.js";
import { authChromeApply } from "./utils/utility-auth.js";
import { authStorageGet } from "./accounts/auth/storage/get.js";
import { dataHandleSync } from "./accounts/data/handle/sync.js";
import { initSectionModules } from "./sections/section-index.js";
import { loadAnimationRun } from "./sections/shell/sequences/load/index.js";
import { qrSetupActionsInstant } from "./sections/overlay/qr-code-setup/action/instant.js";
import { qrSetupAnimationResumePrepare } from "./sections/overlay/qr-code-setup/animation/resume/prepare.js";
import { qrSetupHandlePending } from "./sections/overlay/qr-code-setup/handle/pending.js";
import { qrSetupHandleResume } from "./sections/overlay/qr-code-setup/handle/resume.js";
import { themeChromeStorageSync } from "./utils/utility-theme.js";

void startExtension();

/** Applies theme, restores auth/data, then plays the load intro. */
async function startExtension() {
  await themeChromeStorageSync();
  initSectionModules();

  const resume = await qrSetupHandleResume();

  if (resume) {
    await loadAnimationRun(true, { skipIntro: true });
    qrSetupActionsInstant();
    qrSetupAnimationResumePrepare();
    await qrSetupHandlePending();
    return;
  }

  let isSignedIn = false;

  try {
    const authNumber = await authStorageGet();

    if (!authNumber) {
      await authChromeApply({ authNumber: null, isSignedIn: false });
    } else {
      const verifyResult = await authApiVerify(authNumber);

      if (verifyResult?.success !== true) {
        throw new Error("Account verification failed");
      }

      const accounts = await dataHandleSync(authNumber);
      const hasAccounts = accounts.length > 0;

      await authChromeApply({ authNumber, isSignedIn: true, hasAccounts });
      isSignedIn = true;
    }
  } catch {
    return;
  }

  await loadAnimationRun(isSignedIn);
}
