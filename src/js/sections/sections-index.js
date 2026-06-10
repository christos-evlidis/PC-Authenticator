import { manualSetupInit } from "./overlay/manual-setup/manual-setup-index.js";
import { qrSetupInit } from "./overlay/qr-code-setup/qr-code-setup-index.js";
import { searchInit } from "./shell/search/search-index.js";
import { userMenuInit } from "./overlay/user-menu/user-menu-index.js";

function initSectionModules() {
  userMenuInit();
  searchInit();
  manualSetupInit();
  qrSetupInit();
}

export { initSectionModules };
