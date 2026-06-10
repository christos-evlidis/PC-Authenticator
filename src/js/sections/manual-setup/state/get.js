import { manualSetupStateStore } from "./store.js";

/** Returns a snapshot of the manual-setup state. */
function manualSetupStateGet() {
  return {
    isOpen: manualSetupStateStore.isOpen,
    isSubmitting: manualSetupStateStore.isSubmitting,
  };
}

export { manualSetupStateGet };
