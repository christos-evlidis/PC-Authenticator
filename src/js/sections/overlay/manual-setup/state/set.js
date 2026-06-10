import { manualSetupStateStore } from "./store.js";

/** Updates manual-setup open or submitting state. */
function manualSetupStateSet(next) {
  if (typeof next.isOpen === "boolean") {
    manualSetupStateStore.isOpen = next.isOpen;
  }

  if (typeof next.isSubmitting === "boolean") {
    manualSetupStateStore.isSubmitting = next.isSubmitting;
  }
}

export { manualSetupStateSet };
