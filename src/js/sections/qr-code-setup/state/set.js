import { qrSetupStateStore } from "./store.js";

/** Updates only the QR setup state fields supplied by the caller. */
function qrSetupStateSet(next) {
  if (typeof next.isOpen === "boolean") {
    qrSetupStateStore.isOpen = next.isOpen;
  }

  if (typeof next.isBusy === "boolean") {
    qrSetupStateStore.isBusy = next.isBusy;
  }

  if (typeof next.isAwaitingPageSelection === "boolean") {
    qrSetupStateStore.isAwaitingPageSelection = next.isAwaitingPageSelection;
  }
}

export { qrSetupStateSet };
