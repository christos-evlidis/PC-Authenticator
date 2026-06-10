import { userMenuStateStore } from "./store.js";

/** Updates user menu state fields when provided values are valid. */
function userMenuStateSet(next) {
  if (typeof next.isOpen === "boolean") {
    userMenuStateStore.isOpen = next.isOpen;
  }

  if (typeof next.isSignInRunning === "boolean") {
    userMenuStateStore.isSignInRunning = next.isSignInRunning;
  }

  if (typeof next.authView === "string") {
    userMenuStateStore.authView = next.authView;
  }

  if (typeof next.theme === "string") {
    userMenuStateStore.theme = next.theme;
  }

  if (typeof next.isSignedIn === "boolean") {
    userMenuStateStore.isSignedIn = next.isSignedIn;

    if (next.isSignedIn && typeof next.authNumber === "string") {
      userMenuStateStore.authNumber = next.authNumber;
    } else if (!next.isSignedIn) {
      userMenuStateStore.authNumber = null;
    }
  } else if (typeof next.authNumber === "string") {
    userMenuStateStore.authNumber = next.authNumber;
  } else if (next.authNumber === null) {
    userMenuStateStore.authNumber = null;
  }
}

export { userMenuStateSet };
