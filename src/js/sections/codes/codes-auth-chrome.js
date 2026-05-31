import { cross } from "../section-cross.js";

/** Syncs header, body, and related section bindings for the signed-in state. */
export function setAuthState(isLoggedIn, options = {}) {
  const {
    skipSignedOutReveal = false,
    bodyStaticReveal = false,
    accountNumber = null,
  } = options;

  cross.header.apply(isLoggedIn, accountNumber);
  cross.body.apply(isLoggedIn, accountNumber);

  if (!isLoggedIn && (bodyStaticReveal || !skipSignedOutReveal)) {
    cross.body.animationStatic();
  }

  cross.codes.setSearchAuthVisible(isLoggedIn);

  if (isLoggedIn) {
    cross.manualSetup.refreshBindings();
  }
}

/** Syncs signed-in chrome from storage. */
export async function refreshAuthState(options = {}) {
  const { skipSignedOutReveal = false, bodyStaticReveal = false } = options;
  const { accountNumber } = await chrome.storage.local.get(["accountNumber"]);
  const isLoggedIn = Boolean(accountNumber);

  setAuthState(isLoggedIn, {
    skipSignedOutReveal,
    bodyStaticReveal,
    accountNumber: accountNumber ?? null,
  });

  if (!isLoggedIn) {
    cross.codes.clear();
  }
}

/** Enables or disables header action buttons during edit/delete flows. */
export function setHeaderActionsEnabled(enabled) {
  cross.header.setActionsEnabled(enabled);
}
