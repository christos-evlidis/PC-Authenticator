export { bodyAnimationPlay } from "./body-animations/body-animation-play.js";
export { bodyAnimateForStatic as bodyAnimationStatic } from "./body-animations/body-animate-for-static.js";
export { BODY_PHASE_STATIC } from "./body-constants.js";

import { bodyAnimationPlay } from "./body-animations/body-animation-play.js";
import { BODY_PHASE_STATIC } from "./body-constants.js";
import { bodyViewsApply } from "./body-render/body-views.js";

/** Applies body auth state and updates the DOM. */
export function bodyApply(isSignedIn, accountNumber = null) {
  bodyViewsApply(isSignedIn);
}

/** Cross-section body API. */
export const bodySection = {
  apply: bodyApply,
  animationStatic() {
    bodyAnimationPlay(BODY_PHASE_STATIC);
  },
};
