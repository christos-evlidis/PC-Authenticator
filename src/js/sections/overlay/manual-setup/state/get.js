import { manualSetupStateStore } from "./store.js";

/** Returns current manual-setup open and submitting flags. */
function manualSetupStateGet() {
  return {
    isOpen: manualSetupStateStore.isOpen,
    isSubmitting: manualSetupStateStore.isSubmitting,
  };
}

export { manualSetupStateGet };
