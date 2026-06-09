import { authStorageGet } from "../accounts/accounts-index.js";

import { cross } from "../sections/section-cross.js";

/** Returns whether a stored auth number exists in local storage. */
async function authSignedInIs() {
  return Boolean(await authStorageGet());
}

/** Applies signed-in/out chrome from storage or explicit bootstrap values. */
async function authChromeApply(options = {}) {
  const authNumber =
    options.authNumber === undefined ? await authStorageGet() : options.authNumber;
  const isSignedIn =
    options.isSignedIn === undefined ? Boolean(authNumber) : options.isSignedIn;

  if (options.applyExtensionChrome !== false) {
    if (options.applyHeader !== false) {
      cross.header?.apply(isSignedIn);
    }

    if (options.applyBody !== false) {
      cross.body?.apply(isSignedIn, { hasAccounts: options.hasAccounts });
    }
  }

  if (isSignedIn) {
    cross.userMenu?.apply(true, authNumber);
  } else {
    cross.userMenu?.apply(false);
  }

  cross.search?.apply(isSignedIn);
}

export { authSignedInIs };
export { authChromeApply };
