import { themeApplySplashLogo } from "../../../utils/utility-theme.js";
import { themeRead } from "../../../utils/utility-theme.js";
import { bodyContentResetStart } from "./body-animate-content.js";
import { BODY_ACTIVE_CLASS } from "../body-constants.js";
import { BODY_CONTENT_SELECTOR } from "../body-constants.js";
import { BODY_CONTENT_SIGNED_IN_EMPTY_SELECTOR } from "../body-constants.js";
import { BODY_INTRO_FULLBLEED_CLASS } from "../body-constants.js";
import { BODY_PENDING_CLASS } from "../body-constants.js";
import { BODY_ROOT_SELECTOR } from "../body-constants.js";
import { BODY_SIGNED_IN_EMPTY_MESSAGE_TEXT } from "../body-constants.js";
import { BODY_SIGNED_OUT_MESSAGE_TEXT } from "../body-constants.js";
import { EXTENSION_FRAME_SELECTOR } from "../body-constants.js";
import { FRAME_INTRO_CLASS } from "../body-constants.js";

/** Resets body chrome to the pre-intro hidden state. */
export function bodyAnimateForStart() {
  themeApplySplashLogo(themeRead());

  const frame = document.querySelector(EXTENSION_FRAME_SELECTOR);
  const root = document.querySelector(BODY_ROOT_SELECTOR);
  const signedOutContent = document.querySelector(BODY_CONTENT_SELECTOR);
  const signedInEmptyContent = document.querySelector(
    BODY_CONTENT_SIGNED_IN_EMPTY_SELECTOR,
  );

  frame?.classList.add(FRAME_INTRO_CLASS);
  root?.classList.add(BODY_INTRO_FULLBLEED_CLASS);

  root?.classList.remove(BODY_ACTIVE_CLASS);
  root?.classList.add(BODY_PENDING_CLASS);

  bodyContentResetStart(signedOutContent, BODY_SIGNED_OUT_MESSAGE_TEXT);
  bodyContentResetStart(signedInEmptyContent, BODY_SIGNED_IN_EMPTY_MESSAGE_TEXT);
}
