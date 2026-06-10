import { manualSetupStateStore } from "./store.js";

/** Updates only the manual-setup state fields supplied by the caller. */
function manualSetupStateSet(next) {
  if (typeof next.isOpen === "boolean") {
    manualSetupStateStore.isOpen = next.isOpen;
  }

  if (typeof next.isSubmitting === "boolean") {
    manualSetupStateStore.isSubmitting = next.isSubmitting;
  }
}

export { manualSetupStateSet };
