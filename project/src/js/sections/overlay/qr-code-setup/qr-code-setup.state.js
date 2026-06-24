const _qrSetupStateStore = {
  statePanel: false,
  stateScan: false,
  stateResume: false,
  runIds: { panel: 0, resume: 0 },
};

function _qrSetupStateGet() {
  return {
    statePanel: _qrSetupStateStore.statePanel,
    stateScan: _qrSetupStateStore.stateScan,
    stateResume: _qrSetupStateStore.stateResume,
  };
}

function _qrSetupStateSet(next) {
  if (typeof next.statePanel === "boolean") {
    _qrSetupStateStore.statePanel = next.statePanel;
  }
  if (typeof next.stateScan === "boolean") {
    _qrSetupStateStore.stateScan = next.stateScan;
  }
  if (typeof next.stateResume === "boolean") {
    _qrSetupStateStore.stateResume = next.stateResume;
  }
}

function _qrSetupStateRunIdNext(key) {
  _qrSetupStateStore.runIds[key] += 1;
  return _qrSetupStateStore.runIds[key];
}

function _qrSetupStateRunIdGet(key) {
  return _qrSetupStateStore.runIds[key];
}

export {
  _qrSetupStateGet as qrSetupStateGet,
  _qrSetupStateRunIdGet as qrSetupStateRunIdGet,
  _qrSetupStateRunIdNext as qrSetupStateRunIdNext,
  _qrSetupStateSet as qrSetupStateSet,
};
