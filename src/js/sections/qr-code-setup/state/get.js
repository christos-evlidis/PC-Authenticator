import { qrSetupStateStore } from "./store.js";

/** Returns a snapshot of the QR setup state. */
function qrSetupStateGet() {
  return {
    isOpen: qrSetupStateStore.isOpen,
    isBusy: qrSetupStateStore.isBusy,
    isAwaitingPageSelection: qrSetupStateStore.isAwaitingPageSelection,
  };
}

export { qrSetupStateGet };
