import { themeGet, THEME_LIGHT } from "../../../utils/utility-theme.js";
import { USER_MENU_AUTH_VIEW_SIGN_IN } from "./user-menu.constants.js";

const userMenuStateRunIdsInitial = () => ({
  panel: 0,
  signIn: 0,
  signUp: 0,
  signOut: 0,
  copy: 0,
  download: 0,
});

const userMenuStateStore = {
  isOpen: false,
  isSignedIn: false,
  isAuthRunning: false,
  authNumber: null,
  authView: USER_MENU_AUTH_VIEW_SIGN_IN,
  theme: themeGet() || THEME_LIGHT,
  runIds: userMenuStateRunIdsInitial(),
};

function userMenuStateGet() {
  return {
    isOpen: userMenuStateStore.isOpen,
    isSignedIn: userMenuStateStore.isSignedIn,
    isAuthRunning: userMenuStateStore.isAuthRunning,
    authNumber: userMenuStateStore.authNumber,
    authView: userMenuStateStore.authView,
    theme: userMenuStateStore.theme,
  };
}

function userMenuStateSet(next) {
  if (typeof next.isOpen === "boolean") {
    userMenuStateStore.isOpen = next.isOpen;
  }

  if (typeof next.isAuthRunning === "boolean") {
    userMenuStateStore.isAuthRunning = next.isAuthRunning;
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

function userMenuStateReset() {
  userMenuStateStore.isOpen = false;
  userMenuStateStore.isSignedIn = false;
  userMenuStateStore.isAuthRunning = false;
  userMenuStateStore.authNumber = null;
  userMenuStateStore.authView = USER_MENU_AUTH_VIEW_SIGN_IN;
  userMenuStateStore.theme = themeGet() || THEME_LIGHT;
  userMenuStateStore.runIds = userMenuStateRunIdsInitial();
}

function userMenuStateRunIdNext(key) {
  userMenuStateStore.runIds[key] += 1;
  return userMenuStateStore.runIds[key];
}

function userMenuStateRunIdGet(key) {
  return userMenuStateStore.runIds[key];
}

export { userMenuStateGet };
export { userMenuStateReset };
export { userMenuStateRunIdGet };
export { userMenuStateRunIdNext };
export { userMenuStateSet };
