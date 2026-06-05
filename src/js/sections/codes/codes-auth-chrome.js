import { cross } from "../section-cross.js";
import { authNumberGet } from "../../accounts/accounts-index.js";
import { bodyApply } from "../body/index.js";
import { BODY_ACTIVE_CLASS } from "../body/constants.js";
import { BODY_ANIMATION_PENDING_CLASS } from "../body/constants.js";
import { BODY_CONTENT_SIGNED_OUT_SELECTOR } from "../body/constants.js";
import { BODY_ICON_POP_PENDING_CLASS } from "../body/constants.js";
import { BODY_ICON_POP_REVEALED_CLASS } from "../body/constants.js";
import { BODY_ICON_SELECTOR } from "../body/constants.js";
import { BODY_MESSAGE_DISPLAY_SELECTOR } from "../body/constants.js";
import { BODY_MESSAGE_SPACER_SELECTOR } from "../body/constants.js";
import { BODY_MESSAGE_STACK_SELECTOR } from "../body/constants.js";
import { BODY_MESSAGE_TYPING_CLASS } from "../body/constants.js";
import { BODY_ROOT_SELECTOR } from "../body/constants.js";
import { BODY_SIGNED_OUT_MESSAGE_TEXT } from "../body/constants.js";
import { headerApply, headerIconsDisable, headerIconsEnable } from "../header/index.js";

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
    const content = document.querySelector(BODY_CONTENT_SIGNED_OUT_SELECTOR);
    const root = document.querySelector(BODY_ROOT_SELECTOR);
    const icon = content?.querySelector(BODY_ICON_SELECTOR);
    const stack = content?.querySelector(BODY_MESSAGE_STACK_SELECTOR);
    const spacer = stack?.querySelector(BODY_MESSAGE_SPACER_SELECTOR);
    const display = stack?.querySelector(BODY_MESSAGE_DISPLAY_SELECTOR);
    const stored = stack?.dataset?.fullText;
    const fullText = stored ? stored.replace(/\\n/g, "\n") : BODY_SIGNED_OUT_MESSAGE_TEXT;
    const lines = fullText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const messageHtml =
      lines.length > 1
        ? `${lines[0]}<br>${lines.slice(1).join("<br>")}`
        : fullText.trim();

    root?.classList.remove(BODY_ANIMATION_PENDING_CLASS);
    root?.classList.add(BODY_ACTIVE_CLASS);
    icon?.classList.remove(BODY_ICON_POP_PENDING_CLASS);
    icon?.classList.add(BODY_ICON_POP_REVEALED_CLASS);
    display?.classList.remove(BODY_MESSAGE_TYPING_CLASS);

    if (stack && spacer && display) {
      stack.dataset.fullText = fullText;

      if (messageHtml.includes("<br>")) {
        spacer.innerHTML = messageHtml;
        display.innerHTML = messageHtml;
      } else {
        spacer.textContent = messageHtml;
        display.textContent = messageHtml;
      }
    }

    icon?.classList.add(BODY_ACTIVE_CLASS);
  }

  cross.search?.apply(isLoggedIn);

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
