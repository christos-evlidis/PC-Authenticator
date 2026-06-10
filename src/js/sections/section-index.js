import { cross } from "./section-cross.js";
import { bodyInit } from "./body/index.js";
import { headerInit } from "./header/index.js";
import { searchApply, searchInit, searchReset } from "./search/index.js";
import { userMenuApply } from "./user-menu/index.js";
import { userMenuInit } from "./user-menu/index.js";
import {
  manualSetupActionsPanelClose,
  manualSetupActionsPanelOpen,
  manualSetupInit,
} from "./manual-setup/index.js";
import {
  qrSetupActionsPanelClose,
  qrSetupActionsPanelOpen,
  qrSetupActionsScanStart,
  qrSetupHandlePending,
  qrSetupInit,
} from "./qr-code-setup/index.js";

/** Wires cross-section APIs before bootstrap runs. */
export function registerSections() {
  cross.header = { init: headerInit };
  cross.body = { init: bodyInit };
  cross.search = { apply: searchApply, init: searchInit, reset: searchReset };
  cross.userMenu = { apply: userMenuApply };
  cross.manualSetup = {
    init: manualSetupInit,
    open: manualSetupActionsPanelOpen,
    close: manualSetupActionsPanelClose,
  };
  cross.qrCodeSetup = {
    init: qrSetupInit,
    open: qrSetupActionsPanelOpen,
    close: qrSetupActionsPanelClose,
    workerStartScan: qrSetupActionsScanStart,
    processPendingScan: qrSetupHandlePending,
  };
}

export function initSectionModules() {
  userMenuInit();
  searchInit();
  manualSetupInit();
  qrSetupInit();
}
