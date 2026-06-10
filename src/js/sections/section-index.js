import { manualSetupInit } from "./overlay/manual-setup/index.js";
import { qrSetupInit } from "./overlay/qr-code-setup/index.js";
import { searchInit } from "./shell/search/index.js";
import { userMenuEventsInit } from "./overlay/user-menu/index.js";

function initSectionModules() {
  userMenuEventsInit();
  searchInit();
  manualSetupInit();
  qrSetupInit();
}

export { initSectionModules };
