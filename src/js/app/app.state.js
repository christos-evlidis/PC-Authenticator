const appStateStore = {
  stateAuth: false,
  authKey: null,
};

/**
 * Gets the current application state.
 */
function appStateGet() {
  return {
    stateAuth: appStateStore.stateAuth,
    authKey: appStateStore.authKey,
  };
}

/**
 * Updates the application state with the provided values.
 */
function appStateSet(next) {
  if (typeof next.stateAuth === "boolean") {
    appStateStore.stateAuth = next.stateAuth;
  }
  if (typeof next.authKey === "string" || next.authKey === null) {
    appStateStore.authKey = next.authKey;
  }
}

export { appStateGet };
export { appStateSet };
