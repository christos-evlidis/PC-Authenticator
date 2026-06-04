import { cross } from "../sections/section-cross.js";
import { accountNumberGet } from "../accounts/account-index.js";

/** Returns whether a stored account number exists. */
export async function checkAuth() {
  return Boolean(await accountNumberGet());
}

/** Reads storage and applies header, body, and user-menu auth state. */
export async function refreshAuth() {
  const accountNumber = await accountNumberGet();
  const isSignedIn = Boolean(accountNumber);

  cross.header?.apply(isSignedIn, accountNumber ?? null);
  cross.body?.apply(isSignedIn, accountNumber ?? null);
  cross.userMenu?.apply(isSignedIn, accountNumber ?? null);
}
