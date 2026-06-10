import { userMenuStateStore } from "./store.js";

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
