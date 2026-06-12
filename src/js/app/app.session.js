import { authStorageGet } from "../services/auth/auth-index.js";
import { dataStorageReadyGet } from "../services/data/data-index.js";
import { appShellRefresh } from "./app.shell.js";
import { codesInit } from "../sections/shell/codes/codes-index.js";
import { userMenuRenderSignedIn } from "../sections/overlay/user-menu/user-menu.render.js";
import { userMenuRenderSignedOut } from "../sections/overlay/user-menu/user-menu.render.js";
import { appStateSet } from "./app.state.js";

/**
 * Refreshes the application session state from storage and updates the shell and UI.
 */
async function appSessionRefresh() {
  const authKey = await authStorageGet();

  const authState = Boolean(authKey);

  const accounts = await dataStorageReadyGet();

  appStateSet({
    stateAuth: authState,
    authKey,
  });

  appShellRefresh({
    isSignedIn: authState,
    hasAccounts: accounts.length > 0,
  });

  if (authState) {
    userMenuRenderSignedIn(authKey);
  } else {
    userMenuRenderSignedOut();
  }

  if (authState) {
    await codesInit(accounts);
  }
}

export { appSessionRefresh };
