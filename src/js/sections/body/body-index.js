import { bodyAccountNumberRead } from "./body-state.js";
import { bodyStateGet } from "./body-state.js";
import { bodyStateSet } from "./body-state.js";
import { bodyAnimationStatic } from "./body-animation.js";
import { bodyViewsApply } from "./body-render.js";

export { BODY_ROOT_SELECTOR } from "./body-constants.js";
export { BODY_SIGNED_IN_VIEW_SELECTOR } from "./body-constants.js";
export { BODY_SIGNED_OUT_VIEW_SELECTOR } from "./body-constants.js";
export { BODY_ACCOUNT_NUMBER_KEY } from "./body-constants.js";
export { BODY_SIGNED_OUT_MESSAGE_TEXT } from "./body-constants.js";
export { BODY_ICON_POP_MS } from "./body-constants.js";
export { BODY_MESSAGE_TYPE_MS } from "./body-constants.js";

export { bodyIntroElementsGet } from "./body-render.js";
export { bodyIntroPrepare } from "./body-animation.js";
export { bodyAnimationStatic } from "./body-animation.js";
export { bodyAnimationPlay } from "./body-animation.js";
export { bodyAccountNumberRead } from "./body-state.js";
export { bodySignedInIs } from "./body-state.js";
export { bodyStateGet } from "./body-state.js";

/** Applies body auth state in memory and updates the DOM. */
export function bodyApply(isSignedIn, accountNumber = null) {
  bodyStateSet({
    isSignedIn,
    accountNumber: isSignedIn ? accountNumber : null,
  });

  bodyViewsApply(isSignedIn);
}

/** Re-reads storage and syncs body auth state and DOM. */
export async function bodyRefresh() {
  const accountNumber = await bodyAccountNumberRead();
  const isSignedIn = Boolean(accountNumber);

  bodyApply(isSignedIn, accountNumber);

  return bodyStateGet();
}

/** Cross-section body API. */
export const bodySection = {
  apply: bodyApply,
  refresh: bodyRefresh,
  animationStatic: bodyAnimationStatic,
};
