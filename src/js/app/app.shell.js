import { bodyApplySignedIn, bodyApplySignedOut } from "../sections/shell/body/body-index.js";
import { headerApplySignedIn, headerApplySignedOut } from "../sections/shell/header/header-index.js";
import { searchApply } from "../sections/shell/search/search-index.js";
import { codesApply } from "../sections/shell/codes/codes-index.js";
import { themeStorageGet } from "../services/theme/theme-index.js";
import { appStateGet } from "./app.state.js";

function appShellRefresh(options = {}) {
  const isSignedIn = Boolean(options.isSignedIn);

  if (isSignedIn) {
    appShellRefreshSignedIn(options);
  } else {
    appShellRefreshSignedOut(options);
  }
}

function appShellRefreshSignedIn(options = {}) {
  headerApplySignedIn({ instant: options.instantHeader });
  bodyApplySignedIn({ hasAccounts: options.hasAccounts });
  searchApply(true);
  codesApply(true);
}

function appShellRefreshSignedOut(options = {}) {
  headerApplySignedOut({ instant: options.instantHeader });
  bodyApplySignedOut();
  searchApply(false);
  codesApply(false);
}

function appShellThemeGet() {
  return themeStorageGet();
}

function appShellAuthGet() {
  return appStateGet().authKey;
}

export { appShellRefresh };
export { appShellRefreshSignedIn };
export { appShellRefreshSignedOut };
export { appShellThemeGet };
export { appShellAuthGet };
