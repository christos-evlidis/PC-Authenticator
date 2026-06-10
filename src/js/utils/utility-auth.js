import { authStorageGet } from "../accounts/auth/storage/get.js";
import { bodyInit } from "../sections/shell/body/index.js";
import { headerInit } from "../sections/shell/header/index.js";
import { searchApply } from "../sections/shell/search/index.js";
import { userMenuInit } from "../sections/overlay/user-menu/index.js";

/** Returns whether a stored auth number exists in local storage. */
async function authSignedInIs() {  return Boolean(await authStorageGet());
}

/** Applies signed-in/out chrome from storage or explicit bootstrap values. */
async function authChromeApply(options = {}) {
  const authNumber =
    options.authNumber === undefined ? await authStorageGet() : options.authNumber;
  const isSignedIn =
    options.isSignedIn === undefined ? Boolean(authNumber) : options.isSignedIn;

  if (options.applyExtensionChrome !== false) {
    if (options.applyHeader !== false) {
      headerInit(isSignedIn);
    }

    if (options.applyBody !== false) {
      bodyInit(isSignedIn, { hasAccounts: options.hasAccounts });
    }
  }

  if (isSignedIn) {
    userMenuInit(true, authNumber);
  } else {
    userMenuInit(false);
  }

  searchApply(isSignedIn);
}

export { authChromeApply };
export { authSignedInIs };
