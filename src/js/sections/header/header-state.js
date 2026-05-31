import { HEADER_ACCOUNT_NUMBER_KEY } from "./header-constants.js";

/** In-memory header auth snapshot (isSignedIn, accountNumber). */
let headerState = {
  isSignedIn: false,
  accountNumber: null,
};

/** Returns a snapshot of the current header auth state. */
export function headerStateGet() {
  return {
    isSignedIn: headerState.isSignedIn,
    accountNumber: headerState.accountNumber,
  };
}

/** Returns whether the header is in the signed-in state. */
export function headerSignedInIs() {
  return headerState.isSignedIn;
}

/** Updates the in-memory header auth state. */
export function headerStateSet(next) {
  headerState = {
    isSignedIn: Boolean(next.isSignedIn),
    accountNumber:
      next.isSignedIn && typeof next.accountNumber === "string"
        ? next.accountNumber
        : null,
  };
}

/** Reads the signed-in account number from local storage. */
export async function headerAccountNumberRead() {
  const stored = await chrome.storage.local.get([HEADER_ACCOUNT_NUMBER_KEY]);
  const accountNumber = stored[HEADER_ACCOUNT_NUMBER_KEY];

  if (typeof accountNumber === "string" && accountNumber) {
    return accountNumber;
  }

  return null;
}
