/** In-memory store for QR setup panel, scan, and animation run-ID state. */
const qrSetupStateStore = {
  statePanel: false,
  stateScan: false,
  stateResume: false,
  runIds: { panel: 0, resume: 0 },
};

/** Returns the current QR setup state snapshot. */
function qrSetupStateGet() {
  return {
    statePanel: qrSetupStateStore.statePanel, // Whether the QR setup panel is open.
    stateScan: qrSetupStateStore.stateScan, // Whether a QR scan session is active.
    stateResume: qrSetupStateStore.stateResume, // Whether a scan resume animation is running.
  };
}

/** Updates the QR setup state with the provided values. */
function qrSetupStateSet(next) {
  if (typeof next.statePanel === "boolean") { // Update panel open state when provided.
    qrSetupStateStore.statePanel = next.statePanel; // Store whether the panel is open.
  }
  if (typeof next.stateScan === "boolean") { // Update scan active state when provided.
    qrSetupStateStore.stateScan = next.stateScan; // Store whether a scan is running.
  }
  if (typeof next.stateResume === "boolean") { // Update resume animation state when provided.
    qrSetupStateStore.stateResume = next.stateResume; // Store whether a resume animation is running.
  }
}

/** Increments and returns the next animation run ID for the given key. */
function qrSetupStateRunIdNext(key) {
  qrSetupStateStore.runIds[key] += 1; // Bump the run counter for the requested animation.
  return qrSetupStateStore.runIds[key]; // Return the new run ID for this animation pass.
}

/** Returns the current animation run ID for the given key. */
function qrSetupStateRunIdGet(key) {
  return qrSetupStateStore.runIds[key]; // Return the latest run ID for the requested animation.
}


export { qrSetupStateGet, qrSetupStateRunIdGet, qrSetupStateRunIdNext, qrSetupStateSet };
