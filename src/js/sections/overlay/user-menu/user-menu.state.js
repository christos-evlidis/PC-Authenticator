/** In-memory store for user-menu panel, auth, animation, and run-ID state. */
const userMenuStateStore = {
  statePanel: false,
  stateAuth: false,
  stateAnim: false,
  runIds: { panel: 0, signIn: 0, signUp: 0, signOut: 0, copy: 0, download: 0 },
};

/** Returns the current user-menu state snapshot. */
function userMenuStateGet() {
  return {
    statePanel: userMenuStateStore.statePanel, // Whether the user-menu panel is open.
    stateAuth: userMenuStateStore.stateAuth, // Whether the user-menu is in a signed-in render state.
    stateAnim: userMenuStateStore.stateAnim, // Whether an auth or panel animation is currently running.
  };
}

/** Updates the user-menu state with the provided values. */
function userMenuStateSet(next) {
  if (typeof next.statePanel === "boolean") { // Update panel open state when provided.
    userMenuStateStore.statePanel = next.statePanel; // Store whether the panel is open.
  }
  if (typeof next.stateAuth === "boolean") { // Update signed-in render state when provided.
    userMenuStateStore.stateAuth = next.stateAuth; // Store whether the menu is signed in.
  }
  if (typeof next.stateAnim === "boolean") { // Update animation busy state when provided.
    userMenuStateStore.stateAnim = next.stateAnim; // Store whether an auth animation is running.
  }
}

/** Increments and returns the next animation run ID for the given key. */
function userMenuStateRunIdNext(key) {
  userMenuStateStore.runIds[key] += 1; // Bump the run counter for the requested animation.
  return userMenuStateStore.runIds[key]; // Return the new run ID for this animation pass.
}

/** Returns the current animation run ID for the given key. */
function userMenuStateRunIdGet(key) {
  return userMenuStateStore.runIds[key]; // Return the latest run ID for the requested animation.
}

export { userMenuStateGet, userMenuStateRunIdGet, userMenuStateRunIdNext, userMenuStateSet };
