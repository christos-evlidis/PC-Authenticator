import { cross } from "../sections/section-cross.js";

/** Returns whether a stored account number exists. */
export async function checkAuth() {
  const { accountNumber } = await chrome.storage.local.get(["accountNumber"]);
  return Boolean(accountNumber);
}

/** Reads storage and applies header, body, and user-menu auth state. */
export async function refreshAuth() {
  const { accountNumber } = await chrome.storage.local.get(["accountNumber"]);
  const isSignedIn = Boolean(accountNumber);

  cross.header?.apply(isSignedIn, accountNumber ?? null);
  cross.body?.apply(isSignedIn, accountNumber ?? null);
  cross.userMenu?.apply(isSignedIn, accountNumber ?? null);
}
