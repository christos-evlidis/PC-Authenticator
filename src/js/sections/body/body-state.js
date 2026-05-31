import { BODY_ACCOUNT_NUMBER_KEY } from "./body-constants.js";

/** In-memory body auth snapshot (isSignedIn, accountNumber). */
let bodyState = {
  isSignedIn: false,
  accountNumber: null,
};

/** Returns a snapshot of the current body auth state. */
export function bodyStateGet() {
  return {
    isSignedIn: bodyState.isSignedIn,
    accountNumber: bodyState.accountNumber,
  };
}

/** Returns whether the body is in the signed-in state. */
export function bodySignedInIs() {
  return bodyState.isSignedIn;
}

/** Updates the in-memory body auth state. */
export function bodyStateSet(next) {
  bodyState = {
    isSignedIn: Boolean(next.isSignedIn),
    accountNumber:
      next.isSignedIn && typeof next.accountNumber === "string"
        ? next.accountNumber
        : null,
  };
}

/** Reads the signed-in account number from local storage. */
export async function bodyAccountNumberRead() {
  const stored = await chrome.storage.local.get([BODY_ACCOUNT_NUMBER_KEY]);
  const accountNumber = stored[BODY_ACCOUNT_NUMBER_KEY];

  if (typeof accountNumber === "string" && accountNumber) {
    return accountNumber;
  }

  return null;
}
