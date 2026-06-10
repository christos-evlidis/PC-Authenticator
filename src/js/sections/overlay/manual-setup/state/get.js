import { manualSetupStateStore } from "./store.js";

function manualSetupStateGet() {
  return {
    isOpen: manualSetupStateStore.isOpen,
    isSubmitting: manualSetupStateStore.isSubmitting,
  };
}

export { manualSetupStateGet };
