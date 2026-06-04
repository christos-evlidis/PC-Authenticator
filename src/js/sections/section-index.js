import { cross } from "./section-cross.js";
import { bodyApply } from "./body/body-index.js";
import { codesSection } from "./codes/codes-section.js";
import { initCodes } from "./codes/codes-section.js";
import { initOnLoad } from "./codes/codes-section.js";
import { headerApply } from "./header/header-index.js";
import { userMenuApply } from "./user-menu/user-menu-index.js";
import { userMenuInit } from "./user-menu/user-menu-index.js";
import { initManualSetup } from "./manual-setup/manual-setup-section.js";
import { manualSetupSection } from "./manual-setup/manual-setup-section.js";
import { initQrCodeSetup } from "./qr-code-setup/qr-code-setup-section.js";
import { qrCodeSetupSection } from "./qr-code-setup/qr-code-setup-section.js";
import { initReviewPrompt } from "./review-prompt/review-prompt-section.js";
import { reviewPromptSection } from "./review-prompt/review-prompt-section.js";

/** Wires cross-section APIs before auth or section load runs. */
export function registerSections() {
  cross.codes = codesSection;
  cross.header = { apply: headerApply };
  cross.body = { apply: bodyApply };
  cross.userMenu = { apply: userMenuApply };
  cross.manualSetup = manualSetupSection;
  cross.qrCodeSetup = qrCodeSetupSection;
  cross.reviewPrompt = reviewPromptSection;
}

export function initSectionModules() {
  initReviewPrompt();
  userMenuInit();
  initManualSetup();
  initQrCodeSetup();
  initCodes();
}

export { initCodes };
export { initOnLoad };

export async function loadSections(skipIntroForQrResume = false) {
  await initOnLoad(skipIntroForQrResume);
}
