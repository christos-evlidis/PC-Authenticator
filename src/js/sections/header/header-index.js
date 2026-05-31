import { headerAccountNumberRead } from "./header-state.js";
import { headerStateGet } from "./header-state.js";
import { headerStateSet } from "./header-state.js";
import { headerActionsEnabledSet } from "./header-render.js";
import { headerViewsApply } from "./header-render.js";

export { HEADER_ROOT_SELECTOR } from "./header-constants.js";
export { HEADER_TITLE_SELECTOR } from "./header-constants.js";
export { HEADER_SIGNED_IN_VIEW_SELECTOR } from "./header-constants.js";
export { HEADER_SIGNED_OUT_VIEW_SELECTOR } from "./header-constants.js";
export { HEADER_ACCOUNT_NUMBER_KEY } from "./header-constants.js";
export { HEADER_TITLE_TEXT } from "./header-constants.js";
export { HEADER_TITLE_TYPE_MS } from "./header-constants.js";
export { HEADER_BTN_POP_MS } from "./header-constants.js";
export { HEADER_BTN_POP_STAGGER_MS } from "./header-constants.js";

export { headerIntroPrepare } from "./header-animation.js";
export { headerAnimationStatic } from "./header-animation.js";
export { headerAnimationPlay } from "./header-animation.js";
export { headerActionsEnabledSet } from "./header-render.js";
export { headerVisibleButtonsGet } from "./header-render.js";
export { headerAccountNumberRead } from "./header-state.js";
export { headerSignedInIs } from "./header-state.js";
export { headerStateGet } from "./header-state.js";

/** Applies header auth state in memory and updates the DOM. */
export function headerApply(isSignedIn, accountNumber = null) {
  headerStateSet({
    isSignedIn,
    accountNumber: isSignedIn ? accountNumber : null,
  });

  headerViewsApply(isSignedIn);
}

/** Re-reads storage and syncs header auth state and DOM. */
export async function headerRefresh() {
  const accountNumber = await headerAccountNumberRead();
  const isSignedIn = Boolean(accountNumber);

  headerApply(isSignedIn, accountNumber);

  return headerStateGet();
}

/** Cross-section header API. */
export const headerSection = {
  apply: headerApply,
  refresh: headerRefresh,
  setActionsEnabled: headerActionsEnabledSet,
};
