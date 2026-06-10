import { qrSetupStateStore } from "./store.js";

function qrSetupStateGet() {
  return {
    isOpen: qrSetupStateStore.isOpen,
    isBusy: qrSetupStateStore.isBusy,
    isAwaitingPageSelection: qrSetupStateStore.isAwaitingPageSelection,
  };
}

export { qrSetupStateGet };
