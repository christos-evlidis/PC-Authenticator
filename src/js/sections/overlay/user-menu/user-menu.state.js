const userMenuStateStore = {
  statePanel: false,
  stateAuth: false,
  stateAnim: false,
  runIds: { panel: 0, signIn: 0, signUp: 0, signOut: 0, copy: 0, download: 0 },
};

// Returns the current state of the user menu.
function userMenuStateGet() {
  return {
    statePanel: userMenuStateStore.statePanel,
    stateAuth: userMenuStateStore.stateAuth,
    stateAnim: userMenuStateStore.stateAnim,
  };
}

// Updates the current state of the user menu.
function userMenuStateSet(next) {
  if (typeof next.statePanel === "boolean") {
    userMenuStateStore.statePanel = next.statePanel;
  }

  if (typeof next.stateAuth === "boolean") {
    userMenuStateStore.stateAuth = next.stateAuth;
  }

  if (typeof next.stateAnim === "boolean") {
    userMenuStateStore.stateAnim = next.stateAnim;
  }
}

// Increments and returns the next execution run ID for a given animation key.
function userMenuStateRunIdNext(key) {
  userMenuStateStore.runIds[key] += 1;
  return userMenuStateStore.runIds[key];
}

// Returns the current execution run ID for a given animation key.
function userMenuStateRunIdGet(key) {
  return userMenuStateStore.runIds[key];
}

export { userMenuStateGet, userMenuStateRunIdGet, userMenuStateRunIdNext, userMenuStateSet };
