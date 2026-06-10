import { userMenuStateStore } from "./store.js";

/** Returns a snapshot of the current user menu state. */
function userMenuStateGet() {
  return {
    isOpen: userMenuStateStore.isOpen,
    isSignedIn: userMenuStateStore.isSignedIn,
    isSignInRunning: userMenuStateStore.isSignInRunning,
    authNumber: userMenuStateStore.authNumber,
    authView: userMenuStateStore.authView,
    theme: userMenuStateStore.theme,
  };
}

export { userMenuStateGet };
