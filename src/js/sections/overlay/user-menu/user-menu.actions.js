import { AUTH_NUMBER_LENGTH } from "../../../services/auth/auth-index.js";
import { appSessionRefresh } from "../../../app/app.session.js";
import { appActionSignIn, appActionSignUp, appActionSignOut } from "../../../app/app.actions.js";
import { USER_MENU_AUTH_SIGN_UP_CLASS, USER_MENU_AUTH_VIEW_SIGN_IN, USER_MENU_AUTH_VIEW_SIGN_UP } from "./user-menu.constants.js";
import { userMenuRenderSignedIn } from "./user-menu.render.js";
import { userMenuRenderSignedOut } from "./user-menu.render.js";
import { userMenuRenderSwitchTheme } from "./user-menu.render.js";
import { userMenuRenderSwitchAuth } from "./user-menu.render.js";
import { userMenuAnimationRun, userMenuAnimationSwitchAuth, userMenuAnimationSwitchTheme } from "./user-menu.animation.js";
import { userMenuDomSet } from "./user-menu.dom.js";
import { userMenuStateGet, userMenuStateSet } from "./user-menu.state.js";
import { appStateGet } from "../../../app/app.state.js";
import { appShellThemeGet } from "../../../app/app.shell.js";
import { themeActionApply } from "../../../services/theme/theme-index.js";

// Initiates the sign-in process with the provided account number.
async function userMenuActionSignIn(input) {
  if (userMenuStateGet().stateAnim) {
    return false;
  }

  const isSuccess = await appActionSignIn(input);

  try {
    userMenuStateSet({ stateAnim: true });
    const animResult = await userMenuAnimationRun( "signIn", isSuccess, async () => {
        // Triggered when the result mark starts drawing
        if (isSuccess) {
          await appSessionRefresh();
        } else {
          await appSessionRefresh();
        }
      },
      
      async () => {
        // Triggered right before the user menu fades back in
        if (isSuccess) {
          const authKey = appStateGet().authKey;
          userMenuRenderSignedIn(authKey);
        } else {
          const authKey = appStateGet().authKey;
          userMenuRenderSignedOut(authKey);
        }
      }
    );

    return animResult;
  } finally {
    userMenuStateSet({ stateAnim: false });
  }
}

// Initiates the sign-up process to create a new account.
async function userMenuActionSignUp() {
  if (userMenuStateGet().stateAnim) {
    return false;
  }

  const isSuccess = await appActionSignUp();

  try {
    userMenuStateSet({ stateAnim: true });
    const animResult = await userMenuAnimationRun( "signUp", isSuccess, async () => {
        if (isSuccess) {
          await appSessionRefresh();
        } else {
          await appSessionRefresh();
        }
      },
      async () => {
        if (isSuccess) {
          const authKey = appStateGet().authKey;
          userMenuRenderSignedIn(authKey);
        } else {
          const authKey = appStateGet().authKey;
          userMenuRenderSignedOut(authKey);
        }
      }
    );

    return animResult;
  } finally {
    userMenuStateSet({ stateAnim: false });
  }
}

// Initiates the sign-out process, clearing all local data.
async function userMenuActionSignOut() {
  if (userMenuStateGet().stateAnim) {
    return false;
  }

  userMenuStateSet({ stateAnim: true });
  const authKey = appStateGet().authKey;
  const isSuccess = await appActionSignOut();
  
  try {
    const animResult = await userMenuAnimationRun(
      "signOut",
      isSuccess,
      async () => {
        if (isSuccess) {
          await appSessionRefresh();
        } else {
          await appSessionRefresh();
        }
      },
      async () => {
        if (isSuccess) {
          userMenuRenderSignedOut(authKey);
        } else {
          userMenuRenderSignedIn(authKey);
        }
      }
    );

    return animResult;
  } finally {
    userMenuStateSet({ stateAnim: false });
  }
}

// Switches the authentication view between sign-in and sign-up.
function userMenuActionSwitchAuth(view) {
  view = view === USER_MENU_AUTH_VIEW_SIGN_UP ? USER_MENU_AUTH_VIEW_SIGN_UP : USER_MENU_AUTH_VIEW_SIGN_IN;

  const isSignUp = view === USER_MENU_AUTH_VIEW_SIGN_UP;
  const dom = userMenuDomSet();

  if (dom.authTrack?.classList.contains(USER_MENU_AUTH_SIGN_UP_CLASS) === isSignUp) {
    return;
  }

  userMenuRenderSwitchAuth(view);

  void userMenuAnimationSwitchAuth(view);
}

// Switches the application theme between light and dark.
async function userMenuActionSwitchTheme(theme) {
  const currentTheme = appShellThemeGet();

  if (currentTheme === theme) {
    return;
  }

  themeActionApply(theme);

  userMenuRenderSwitchTheme(theme);
  
  void userMenuAnimationSwitchTheme(theme);
}

export { userMenuActionSignIn, userMenuActionSignOut, userMenuActionSignUp, userMenuActionSwitchAuth, userMenuActionSwitchTheme };
