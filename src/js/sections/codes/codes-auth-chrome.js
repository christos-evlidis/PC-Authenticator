import { cross } from "../section-cross.js";
import { authNumberGet } from "../../accounts/accounts-index.js";
import { bodyApply } from "../body/index.js";
import { bodyAnimationPlay } from "../body/index.js";
import { BODY_PHASE_SIGNED_OUT_CONTENT } from "../body/constants.js";
import { headerApply } from "../header/header-index.js";
import { headerIconsDisable } from "../header/header-index.js";
import { headerIconsEnable } from "../header/header-index.js";

/** Syncs header, body, and related section bindings for the signed-in state. */
export function setAuthState(isLoggedIn, options = {}) {
  const {
    skipSignedOutReveal = false,
    bodyStaticReveal = false,
    authNumber,
  } = options;

  headerApply(isLoggedIn);
  bodyApply(isLoggedIn);

  if (isLoggedIn && authNumber) {
    cross.userMenu?.apply(true, authNumber);
  } else {
    cross.userMenu?.apply(false);
  }

  if (!isLoggedIn && (bodyStaticReveal || !skipSignedOutReveal)) {
    bodyAnimationPlay(BODY_PHASE_SIGNED_OUT_CONTENT, { static: true });
  }

  cross.codes.setSearchAuthVisible(isLoggedIn);

  if (isLoggedIn) {
    cross.manualSetup.refreshBindings();
  }
}

/** Syncs signed-in chrome from verified storage. */
export async function refreshAuthState(options = {}) {
  const { skipSignedOutReveal = false, bodyStaticReveal = false } = options;
  const authNumber = await authNumberGet();
  const isLoggedIn = Boolean(authNumber);

  setAuthState(isLoggedIn, {
    skipSignedOutReveal,
    bodyStaticReveal,
    authNumber,
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
