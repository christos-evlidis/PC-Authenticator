import { themeApplySplashLogo } from "../../../utils/utility-theme.js";
import { themeRead } from "../../../utils/utility-theme.js";
import { bodyAnimateForSignedInContent } from "./signed-in-content.js";
import { bodyAnimateForSignedOutContent } from "./signed-out-content.js";
import { BODY_ACTIVE_CLASS } from "../constants.js";
import { BODY_ANIMATE_FOR_START_CLASS } from "../constants.js";
import { BODY_PENDING_CLASS } from "../constants.js";
import { BODY_ROOT_SELECTOR } from "../constants.js";
import { EXTENSION_FRAME_SELECTOR } from "../constants.js";

/** Resets body chrome to the pre-start hidden state. */
export function bodyAnimateForStart() {
  themeApplySplashLogo(themeRead());

  const frame = document.querySelector(EXTENSION_FRAME_SELECTOR);
  const root = document.querySelector(BODY_ROOT_SELECTOR);

  frame?.classList.add(BODY_ANIMATE_FOR_START_CLASS);
  root?.classList.add(BODY_ANIMATE_FOR_START_CLASS);

  root?.classList.remove(BODY_ACTIVE_CLASS);
  root?.classList.add(BODY_PENDING_CLASS);

  void bodyAnimateForSignedOutContent({ reset: true });
  void bodyAnimateForSignedInContent({ reset: true });
}
