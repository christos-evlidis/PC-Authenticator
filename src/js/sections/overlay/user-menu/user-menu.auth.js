import { AUTH_NUMBER_LENGTH } from "../../../accounts/accounts-const.js";
import { authApiCreate, authApiVerify, authSanitizeNumber, authStorageClear, authStorageGet, authStorageSet, dataHandleSync, dataStoragePurge } from "../../../accounts/accounts-index.js";
import { bodyAnimationFinish, bodyInit } from "../../shell/body/body-index.js";
import { codesApply, codesInit } from "../../shell/codes/codes-index.js";
import { headerAnimationInstant, headerInit } from "../../shell/header/header-index.js";
import { searchApply } from "../../shell/search/search-index.js";
import { userMenuDomSet } from "./user-menu.dom.js";
import { userMenuRenderSignedIn, userMenuRenderSignedOut } from "./user-menu.render.js";
import { userMenuAnimationRun } from "./user-menu.animation.js";
import { USER_MENU_ACTIVE_CLASS, USER_MENU_AUTH_SIGN_IN_CLASS, USER_MENU_AUTH_SIGN_UP_CLASS, USER_MENU_AUTH_VIEW_SIGN_IN, USER_MENU_AUTH_VIEW_SIGN_UP } from "./user-menu.constants.js";
import { userMenuStateGet, userMenuStateSet } from "./user-menu.state.js";

// Synchronizes the application shell state (excluding user menu) with the authentication status.
// move into another category later. like app.session or smth.
async function userMenuShellApply(options = {}) {
  const authNumber = options.authNumber === undefined ? await authStorageGet() : options.authNumber;
  const isSignedIn = options.isSignedIn === undefined ? Boolean(authNumber) : options.isSignedIn;

  headerInit(isSignedIn);
  bodyInit(isSignedIn, { hasAccounts: options.hasAccounts });
  searchApply(isSignedIn);
  codesApply(isSignedIn);
}

// Initiates the sign-in process with the provided account number.
async function userMenuStartSignIn(input) {
  if (userMenuStateGet().stateAnim) {
    return false;
  }

  const sanitized = authSanitizeNumber(input);

  if (sanitized.length !== AUTH_NUMBER_LENGTH) {
    return false;
  }

  userMenuStateSet({ stateAnim: true });
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

  let accounts = [];

  try {
    const animResult = await userMenuAnimationRun(
      "signIn",
      isSuccess,
      async () => {
        // Triggered when the result mark starts drawing
        if (isSuccess) {
          const authNumber = await authStorageGet();
          accounts = authNumber ? await dataHandleSync(authNumber) : [];

          await userMenuShellApply({ hasAccounts: accounts.length > 0 });
          await codesInit(accounts, { playIntro: false });
          bodyAnimationFinish();
          headerAnimationInstant();
        }
      },
      async () => {
        // Triggered right before the user menu fades back in
        if (isSuccess) {
          userMenuDomSet({ accountFieldSignedOut: "" });
          const authNumber = await authStorageGet();
          userMenuRenderSignedIn(authNumber);
        } else {
          const dom = userMenuDomSet({ showViewSignIn: true, showViewSignUp: false });

          dom.authBtns.forEach((button) => {
            button.classList.toggle(USER_MENU_ACTIVE_CLASS, button.dataset.view === USER_MENU_AUTH_VIEW_SIGN_IN);
          });

          dom.authTrack?.classList.toggle(USER_MENU_AUTH_SIGN_IN_CLASS, true);
          dom.authTrack?.classList.toggle(USER_MENU_AUTH_SIGN_UP_CLASS, false);
        }
      }
    );

    return animResult;
  } finally {
    userMenuStateSet({ stateAnim: false });
  }
}

// Initiates the sign-up process to create a new account.
async function userMenuStartSignUp() {
  if (userMenuStateGet().stateAnim) {
    return false;
  }

  userMenuStateSet({ stateAnim: true });
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

  try {
    const animResult = await userMenuAnimationRun(
      "signUp",
      isSuccess,
      async () => {
        if (isSuccess) {
          await userMenuShellApply({ hasAccounts: false });
          await codesInit([], { playIntro: false });
          bodyAnimationFinish();
          headerAnimationInstant();
        }
      },
      async () => {
        if (isSuccess) {
          userMenuDomSet({ accountFieldSignedOut: "" });
          const authNumber = await authStorageGet();
          userMenuRenderSignedIn(authNumber);
        } else {
          const dom = userMenuDomSet({ showViewSignIn: false, showViewSignUp: true });

          dom.authBtns.forEach((button) => {
            button.classList.toggle(USER_MENU_ACTIVE_CLASS, button.dataset.view === USER_MENU_AUTH_VIEW_SIGN_UP);
          });

          dom.authTrack?.classList.toggle(USER_MENU_AUTH_SIGN_IN_CLASS, false);
          dom.authTrack?.classList.toggle(USER_MENU_AUTH_SIGN_UP_CLASS, true);
        }
      }
    );

    return animResult;
  } finally {
    userMenuStateSet({ stateAnim: false });
  }
}

// Initiates the sign-out process, clearing all local data.
async function userMenuStartSignOut() {
  if (userMenuStateGet().stateAnim) {
    return false;
  }

  userMenuStateSet({ stateAnim: true });
  
  try {
    await authStorageClear();
    await dataStoragePurge();

    await userMenuAnimationRun(
      "signOut",
      true,
      async () => {
        await userMenuShellApply();
        bodyAnimationFinish();
      },
      async () => {
        userMenuDomSet({ accountFieldSignedOut: "" });
        userMenuRenderSignedOut();
      }
    );

    return true;
  } finally {
    userMenuStateSet({ stateAnim: false });
  }
}

export { userMenuStartSignIn, userMenuStartSignOut, userMenuStartSignUp };
