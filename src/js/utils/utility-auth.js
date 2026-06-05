import { authNumberGet } from "../accounts/accounts-index.js";

import { cross } from "../sections/section-cross.js";

/** Returns whether a stored auth number exists in local storage. */
async function checkAuth() {
  return Boolean(await authNumberGet());
}

/** Applies signed-in/out chrome from storage or explicit bootstrap values. */
async function refreshAuth(options = {}) {
  const authNumber =
    options.authNumber === undefined ? await authNumberGet() : options.authNumber;
  const isSignedIn =
    options.isSignedIn === undefined ? Boolean(authNumber) : options.isSignedIn;

  cross.header?.apply(isSignedIn);
  cross.body?.apply(isSignedIn);

  if (isSignedIn) {
    cross.userMenu?.apply(true, authNumber);
  } else {
    cross.userMenu?.apply(false);
  }

  cross.search?.apply(isSignedIn);
}

export { checkAuth };
export { refreshAuth };
