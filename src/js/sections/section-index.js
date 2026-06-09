import { cross } from "./section-cross.js";
import { bodyApply } from "./body/index.js";
import { headerApply } from "./header/index.js";
import { searchApply, searchInit, searchReset } from "./search/index.js";
import { userMenuApply } from "./user-menu/index.js";
import { userMenuInit } from "./user-menu/index.js";
import { manualSetupSection } from "./manual-setup/index.js";
import { qrCodeSetupSection } from "./qr-code-setup/index.js";

/** Wires cross-section APIs before bootstrap runs. */
export function registerSections() {
  cross.header = { apply: headerApply };
  cross.body = { apply: bodyApply };
  cross.search = { apply: searchApply, init: searchInit, reset: searchReset };
  cross.userMenu = { apply: userMenuApply };
  cross.manualSetup = manualSetupSection;
  cross.qrCodeSetup = qrCodeSetupSection;
}

export function initSectionModules() {
  userMenuInit();
  searchInit();
  manualSetupSection.init();
  qrCodeSetupSection.init();
}
