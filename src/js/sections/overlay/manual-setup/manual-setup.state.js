const manualSetupStateStore = {
  isOpen: false,
  isSubmitting: false,
  runIds: { panel: 0, submit: 0 },
};

function manualSetupStateGet() {
  return {
    isOpen: manualSetupStateStore.isOpen,
    isSubmitting: manualSetupStateStore.isSubmitting,
  };
}

function manualSetupStateSet(next) {
  if (typeof next.isOpen === "boolean") {
    manualSetupStateStore.isOpen = next.isOpen;
  }
  if (typeof next.isSubmitting === "boolean") {
    manualSetupStateStore.isSubmitting = next.isSubmitting;
  }
}

function manualSetupStateRunIdNext(key) {
  manualSetupStateStore.runIds[key] += 1;
  return manualSetupStateStore.runIds[key];
}

function manualSetupStateRunIdGet(key) {
  return manualSetupStateStore.runIds[key];
}

export { manualSetupStateGet };
export { manualSetupStateRunIdGet };
export { manualSetupStateRunIdNext };
export { manualSetupStateSet };
