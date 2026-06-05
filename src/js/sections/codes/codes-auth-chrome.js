import { cross } from "../section-cross.js";
import { authNumberGet } from "../../accounts/account-index.js";
import { bodyApply } from "../body/body-index.js";
import { bodyAnimationPlay } from "../body/body-index.js";
import { BODY_PHASE_SIGNED_OUT_CONTENT } from "../body/body-constants.js";
import { headerApply } from "../header/header-index.js";
import { headerIconsDisable } from "../header/header-index.js";
import { headerIconsEnable } from "../header/header-index.js";

/** Syncs header, body, and related section bindings for the signed-in state. */
export function setAuthState(isLoggedIn, options = {}) {
  const {
    skipSignedOutReveal = false,
    bodyStaticReveal = false,
    accountNumber = null,
  } = options;

  headerApply(isLoggedIn);
  bodyApply(isLoggedIn);
  cross.userMenu?.apply(isLoggedIn, accountNumber);

  if (!isLoggedIn && (bodyStaticReveal || !skipSignedOutReveal)) {
    bodyAnimationPlay(BODY_PHASE_SIGNED_OUT_CONTENT, { static: true });
  }

  cross.codes.setSearchAuthVisible(isLoggedIn);

  if (isLoggedIn) {
    cross.manualSetup.refreshBindings();
  }
}

/** Syncs signed-in chrome from storage. */
export async function refreshAuthState(options = {}) {
  const { skipSignedOutReveal = false, bodyStaticReveal = false } = options;
  const accountNumber = await authNumberGet();
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
  if (enabled) {
    headerIconsEnable();
  } else {
    headerIconsDisable();
  }
}
