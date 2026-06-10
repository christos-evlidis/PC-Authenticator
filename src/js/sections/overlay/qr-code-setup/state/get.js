import { qrSetupStateStore } from "./store.js";

/** Returns a snapshot of QR setup UI state flags. */
function qrSetupStateGet() {
  return {
    isOpen: qrSetupStateStore.isOpen,
    isBusy: qrSetupStateStore.isBusy,
    isAwaitingPageSelection: qrSetupStateStore.isAwaitingPageSelection,
  };
}

export { qrSetupStateGet };
