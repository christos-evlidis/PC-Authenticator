import { themeApplySplashLogo } from "../../../utils/utility-theme.js";
import { themeRead } from "../../../utils/utility-theme.js";
import { bodyAnimateForSignedInStart } from "./body-animate-for-signed-in-content.js";
import { bodyAnimateForSignedOutStart } from "./body-animate-for-signed-out-content.js";
import { BODY_ACTIVE_CLASS } from "../body-constants.js";
import { BODY_INTRO_FULLBLEED_CLASS } from "../body-constants.js";
import { BODY_PENDING_CLASS } from "../body-constants.js";
import { BODY_ROOT_SELECTOR } from "../body-constants.js";
import { EXTENSION_FRAME_SELECTOR } from "../body-constants.js";
import { FRAME_INTRO_CLASS } from "../body-constants.js";

/** Resets body chrome to the pre-intro hidden state. */
export function bodyAnimateForStart() {
  themeApplySplashLogo(themeRead());

  const frame = document.querySelector(EXTENSION_FRAME_SELECTOR);
  const root = document.querySelector(BODY_ROOT_SELECTOR);

  frame?.classList.add(FRAME_INTRO_CLASS);
  root?.classList.add(BODY_INTRO_FULLBLEED_CLASS);

  root?.classList.remove(BODY_ACTIVE_CLASS);
  root?.classList.add(BODY_PENDING_CLASS);

  bodyAnimateForSignedOutStart();
  bodyAnimateForSignedInStart();
}
