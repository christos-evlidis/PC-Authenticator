import { HEADER_ROOT_SELECTOR } from "./header-constants.js";
import { HEADER_SIGNED_IN_VIEW_SELECTOR } from "./header-constants.js";
import { HEADER_SIGNED_OUT_VIEW_SELECTOR } from "./header-constants.js";

/** Returns action buttons for the currently visible signed-in/out header view. */
export function headerVisibleButtonsGet() {
  const header = document.querySelector(HEADER_ROOT_SELECTOR);

  if (!header) {
    return [];
  }

  const activeView =
    header.querySelector(".signed-in-view:not(.hidden)") ||
    header.querySelector(".signed-out-view:not(.hidden)");

  if (!activeView) {
    return [];
  }

  return [...activeView.querySelectorAll(".app-header__btn")];
}

/** Updates header signed-in vs signed-out view visibility in the DOM. */
export function headerViewsApply(isSignedIn) {
  const signedOutView = document.querySelector(HEADER_SIGNED_OUT_VIEW_SELECTOR);
  const signedInView = document.querySelector(HEADER_SIGNED_IN_VIEW_SELECTOR);

  if (signedOutView) {
    signedOutView.classList.toggle("hidden", isSignedIn);
  }

  if (signedInView) {
    signedInView.classList.toggle("hidden", !isSignedIn);
  }
}

/** Enables or disables header action buttons during edit/delete flows. */
export function headerActionsEnabledSet(enabled) {
  const header = document.querySelector(HEADER_ROOT_SELECTOR);

  if (header) {
    header.classList.toggle("app-header--actions-disabled", !enabled);
  }

  document.querySelectorAll(".app-header__btn").forEach((button) => {
    button.disabled = !enabled;
    button.setAttribute("aria-disabled", enabled ? "false" : "true");
  });
}
