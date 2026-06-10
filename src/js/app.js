import { bootstrap } from "./bootstrap.js";
import { loadAnimationRun } from "./sections/sequences/index.js";
import { cross } from "./sections/section-cross.js";
import { initSectionModules } from "./sections/section-index.js";
import { registerSections } from "./sections/section-index.js";
import { qrSetupActionsInstant } from "./sections/qr-code-setup/index.js";
import { qrSetupHandleResume } from "./sections/qr-code-setup/index.js";
import { themeChromeStorageSync } from "./utils/utility-theme.js";

void startExtension();

/** Applies theme, bootstraps auth/data restore, then plays the load intro. */
async function startExtension() {
  await themeChromeStorageSync();
  registerSections();
  initSectionModules();

  const resume = await qrSetupHandleResume();

  if (resume) {
    await loadAnimationRun(true, { skipIntro: true });
    qrSetupActionsInstant();
    await cross.qrCodeSetup.processPendingScan({ instantOpen: true });
    return;
  }

  let isSignedIn = false;

  try {
    ({ isSignedIn } = await bootstrap());
  } catch {
    return;
  }

  await loadAnimationRun(isSignedIn);
}
