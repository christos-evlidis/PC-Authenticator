import { cross } from "../sections/section-cross.js";
import { authNumberGet } from "../accounts/accounts-index.js";

/** Returns whether a stored auth number exists in local storage. */
export async function checkAuth() {
  return Boolean(await authNumberGet());
}

/** Reads storage and applies signed-in/out state to header, body, and user menu. */
export async function refreshAuth() {
  const authNumber = await authNumberGet();
  const isSignedIn = Boolean(authNumber);

  cross.header?.apply(isSignedIn);
  cross.body?.apply(isSignedIn);

  if (isSignedIn) {
    cross.userMenu?.apply(true, authNumber);
  } else {
    cross.userMenu?.apply(false);
  }

  cross.search?.apply(isSignedIn);
  await cross.codes?.bootstrapOnce?.();
}
