const qrSetupStateStore = {
  statePanel: false,
  stateScan: false,
  stateLock: false,
  runIds: {
    panel: 0,
    resume: 0,
  },
};

// Returns the current UI and scan state.
function qrSetupStateGet() {
  return {
    statePanel: qrSetupStateStore.statePanel,
    stateScan: qrSetupStateStore.stateScan,
    stateLock: qrSetupStateStore.stateLock,
  };
}

// Updates the UI and scan state.
function qrSetupStateSet(next) {
  if (typeof next.statePanel === "boolean") {
    qrSetupStateStore.statePanel = next.statePanel;
  }

  if (typeof next.stateScan === "boolean") {
    qrSetupStateStore.stateScan = next.stateScan;
  }

  if (typeof next.stateLock === "boolean") {
    qrSetupStateStore.stateLock = next.stateLock;
  }
}

// Increments and returns the next run ID for a given animation/process key.
function qrSetupStateRunIdNext(key) {
  qrSetupStateStore.runIds[key] += 1;
  
  return qrSetupStateStore.runIds[key];
}

// Retrieves the current run ID for a given animation/process key.
function qrSetupStateRunIdGet(key) {
  return qrSetupStateStore.runIds[key];
}


export {
  qrSetupStateGet,
  qrSetupStateSet,
  qrSetupStateRunIdGet,
  qrSetupStateRunIdNext,
};
