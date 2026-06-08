let qrSetupState = {
  isOpen: false,
  isBusy: false,
  isAwaitingPageSelection: false,
};

/** Returns a snapshot of the QR setup state. */
function qrSetupStateGet() {
  return {
    isOpen: qrSetupState.isOpen,
    isBusy: qrSetupState.isBusy,
    isAwaitingPageSelection: qrSetupState.isAwaitingPageSelection,
  };
}

/** Updates only the QR setup state fields supplied by the caller. */
function qrSetupStateSet(next) {
  qrSetupState = {
    isOpen: typeof next.isOpen === "boolean" ? next.isOpen : qrSetupState.isOpen,
    isBusy: typeof next.isBusy === "boolean" ? next.isBusy : qrSetupState.isBusy,
    isAwaitingPageSelection:
      typeof next.isAwaitingPageSelection === "boolean"
        ? next.isAwaitingPageSelection
        : qrSetupState.isAwaitingPageSelection,
  };
}

export { qrSetupStateGet };
export { qrSetupStateSet };
