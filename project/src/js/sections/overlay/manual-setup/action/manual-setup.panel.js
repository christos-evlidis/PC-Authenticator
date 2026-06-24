import { manualSetupDomGet } from "../manual-setup.dom.js";
import { manualSetupStateGet, manualSetupStateSet } from "../manual-setup.state.js";
import { MANUAL_SETUP_HIDDEN_CLASS, MANUAL_SETUP_OPEN_CLASS } from "../../../../const/const.manual-setup.js";

async function _manualSetupPanelOpen() {
  if (manualSetupStateGet().isOpen || manualSetupStateGet().isSubmitting) {
    return;
  }
  manualSetupStateSet({ isOpen: true });
  const dom = manualSetupDomGet();
  dom.root?.classList.remove(MANUAL_SETUP_HIDDEN_CLASS);
  dom.root?.classList.add(MANUAL_SETUP_OPEN_CLASS);
}

async function _manualSetupPanelClose() {
  if (!manualSetupStateGet().isOpen || manualSetupStateGet().isSubmitting) {
    return;
  }
  manualSetupStateSet({ isOpen: false, isSubmitting: false });
  const dom = manualSetupDomGet();
  dom.root?.classList.add(MANUAL_SETUP_HIDDEN_CLASS);
  dom.root?.classList.remove(MANUAL_SETUP_OPEN_CLASS);
}

export { _manualSetupPanelClose as manualSetupPanelClose, _manualSetupPanelOpen as manualSetupPanelOpen };
