let manualSetupState = {
  isOpen: false,
  isSubmitting: false,
};

/** Returns a snapshot of the manual-setup state. */
function manualSetupStateGet() {
  return {
    isOpen: manualSetupState.isOpen,
    isSubmitting: manualSetupState.isSubmitting,
  };
}

/** Updates only the manual-setup state fields supplied by the caller. */
function manualSetupStateSet(next) {
  manualSetupState = {
    isOpen: typeof next.isOpen === "boolean" ? next.isOpen : manualSetupState.isOpen,
    isSubmitting:
      typeof next.isSubmitting === "boolean"
        ? next.isSubmitting
        : manualSetupState.isSubmitting,
  };
}

export { manualSetupStateGet };
export { manualSetupStateSet };
