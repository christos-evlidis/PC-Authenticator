import { AUTH_NUMBER_LENGTH } from "../../../accounts/accounts-const.js";
import { authApiCreate, authApiVerify, authSanitizeNumber, authStorageClear, authStorageGet, authStorageSet, dataHandleSync, dataStoragePurge } from "../../../accounts/accounts-index.js";
import { bodyAnimationFinish, bodyInit } from "../../shell/body/body-index.js";
import { codesApply, codesInit } from "../../shell/codes/codes-index.js";
import { headerAnimationInstant, headerInit } from "../../shell/header/header-index.js";
import { searchApply } from "../../shell/search/search-index.js";
import { userMenuDomGet, userMenuDomSet } from "./user-menu.dom.js";
import { userMenuRenderSignedIn, userMenuRenderSignedOut } from "./user-menu.render.js";
import { userMenuStateGet, userMenuStateSet } from "./user-menu.state.js";
import { userMenuRunAnimation, userMenuAnimationAuthThumb } from "./user-menu.animation.js";
import { userMenuThemeSyncFromChrome } from "./user-menu.theme.js";
import { USER_MENU_ACTIVE_CLASS, USER_MENU_AUTH_SIGN_IN_CLASS, USER_MENU_AUTH_SIGN_UP_CLASS, USER_MENU_AUTH_VIEW_SIGN_IN, USER_MENU_AUTH_VIEW_SIGN_UP, USER_MENU_HIDDEN_CLASS } from "./user-menu.constants.js";

// TODO: Move app shell coordination out of user-menu auth into an app/session coordinator.
async function userMenuAuthChromeApply(options = {}) {
  const authNumber =
    options.authNumber === undefined ? await authStorageGet() : options.authNumber;
  const isSignedIn =
    options.isSignedIn === undefined ? Boolean(authNumber) : options.isSignedIn;

  headerInit(isSignedIn);
  bodyInit(isSignedIn, { hasAccounts: options.hasAccounts });

  if (isSignedIn) {
    userMenuRenderSignedIn(authNumber);
  } else {
    userMenuRenderSignedOut();
  }

  searchApply(isSignedIn);
  codesApply(isSignedIn);
}

async function userMenuAuthRestoreSuccess() {
  userMenuDomSet({ signInValue: "" });
  userMenuThemeSyncFromChrome();

  const authNumber = await authStorageGet();
  const accounts = authNumber ? await dataHandleSync(authNumber) : [];

  await userMenuAuthChromeApply({ hasAccounts: accounts.length > 0 });
  await codesInit(accounts, { playIntro: false });
  bodyAnimationFinish();
  headerAnimationInstant();
  return [];
}

async function userMenuAuthRestoreFailure(view) {
  const dom = userMenuDomGet();
  const isSignUp = view === USER_MENU_AUTH_VIEW_SIGN_UP;

  dom.signInView?.classList.toggle(USER_MENU_HIDDEN_CLASS, isSignUp);
  dom.signUpView?.classList.toggle(USER_MENU_HIDDEN_CLASS, !isSignUp);

  dom.authBtns.forEach((button) => {
    button.classList.toggle(USER_MENU_ACTIVE_CLASS, button.dataset.view === view);
  });

  dom.authTrack?.classList.toggle(USER_MENU_AUTH_SIGN_IN_CLASS, !isSignUp);
  dom.authTrack?.classList.toggle(USER_MENU_AUTH_SIGN_UP_CLASS, isSignUp);
  return [];
}

function userMenuAuthSwitch(authView) {
  if (userMenuStateGet().isAuthRunning) {
    return;
  }

  const nextView =
    authView === USER_MENU_AUTH_VIEW_SIGN_UP
      ? USER_MENU_AUTH_VIEW_SIGN_UP
      : USER_MENU_AUTH_VIEW_SIGN_IN;

  if (userMenuStateGet().authView === nextView) {
    return;
  }

  userMenuStateSet({ authView: nextView });

  const dom = userMenuDomGet();
  const isSignUp = nextView === USER_MENU_AUTH_VIEW_SIGN_UP;

  dom.signInView?.classList.toggle(USER_MENU_HIDDEN_CLASS, isSignUp);
  dom.signUpView?.classList.toggle(USER_MENU_HIDDEN_CLASS, !isSignUp);

  dom.authBtns.forEach((button) => {
    button.classList.toggle(USER_MENU_ACTIVE_CLASS, button.dataset.view === nextView);
  });

  void userMenuAnimationAuthThumb(nextView);
}

async function userMenuStartSignIn(input) {
  if (userMenuStateGet().isAuthRunning) {
    return false;
  }

  userMenuStateSet({ isAuthRunning: true });

  try {
    const sanitized = authSanitizeNumber(input);

    if (sanitized.length !== AUTH_NUMBER_LENGTH) {
      return false;
    }

    let isSuccess = false;

    try {
      const result = await authApiVerify(sanitized);

      if (result?.success === true) {
        await authStorageSet(sanitized);
        isSuccess = true;
      }
    } catch {
      isSuccess = false;
    }

    return await userMenuRunAnimation("signIn", isSuccess, async (resultIsSuccess) => {
      if (resultIsSuccess) {
        return userMenuAuthRestoreSuccess();
      }

      return userMenuAuthRestoreFailure(USER_MENU_AUTH_VIEW_SIGN_IN);
    });
  } finally {
    userMenuStateSet({ isAuthRunning: false });
  }
}

async function userMenuStartSignUp() {
  if (userMenuStateGet().isAuthRunning) {
    return false;
  }

  userMenuStateSet({ isAuthRunning: true });

  try {
    let isSuccess = false;

    try {
      const authNumber = await authApiCreate();
      const sanitized = authSanitizeNumber(authNumber);

      if (sanitized.length === AUTH_NUMBER_LENGTH) {
        await authStorageSet(sanitized);
        isSuccess = true;
      }
    } catch {
      isSuccess = false;
    }

    return await userMenuRunAnimation("signUp", isSuccess, async (resultIsSuccess) => {
      if (resultIsSuccess) {
        userMenuDomSet({ signInValue: "" });
        userMenuThemeSyncFromChrome();
        await userMenuAuthChromeApply({ hasAccounts: false });
        await codesInit([], { playIntro: false });
        bodyAnimationFinish();
        headerAnimationInstant();
        return [];
      }

      return userMenuAuthRestoreFailure(USER_MENU_AUTH_VIEW_SIGN_UP);
    });
  } finally {
    userMenuStateSet({ isAuthRunning: false });
  }
}

async function userMenuStartSignOut() {
  if (userMenuStateGet().isAuthRunning) {
    return false;
  }

  userMenuStateSet({ isAuthRunning: true });

  try {
    await authStorageClear();
    await dataStoragePurge();

    return await userMenuRunAnimation("signOut", true, async () => {
      await userMenuAuthRestoreFailure(USER_MENU_AUTH_VIEW_SIGN_IN);
      userMenuDomSet({ signInValue: "" });
      await userMenuAuthChromeApply();
      bodyAnimationFinish();
      return [];
    });
  } finally {
    userMenuStateSet({ isAuthRunning: false });
  }
}

export { userMenuAuthSwitch };
export { userMenuStartSignIn };
export { userMenuStartSignOut };
export { userMenuStartSignUp };
