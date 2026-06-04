import { bodyAnimateForSignedInContent } from "./body-animate-for-signed-in-content.js";
import { bodyAnimateForSignedOutContent } from "./body-animate-for-signed-out-content.js";
import { bodyAnimateForSignedOutStatic } from "./body-animate-for-signed-out-content.js";
import { bodyAnimateForExtensionFrame } from "./body-animate-for-extension-frame.js";
import { bodyAnimateForFinish } from "./body-animate-for-finish.js";
import { bodyAnimateForHeader } from "./body-animate-for-header.js";
import { bodyAnimateForLogo } from "./body-animate-for-logo.js";
import { bodyAnimateForStart } from "./body-animate-for-start.js";
import { BODY_PHASE_SIGNED_IN_CONTENT } from "../body-constants.js";
import { BODY_PHASE_CONTENT } from "../body-constants.js";
import { BODY_PHASE_EXTENSION_FRAME } from "../body-constants.js";
import { BODY_PHASE_FINISH } from "../body-constants.js";
import { BODY_PHASE_HEADER } from "../body-constants.js";
import { BODY_PHASE_LOGO } from "../body-constants.js";
import { BODY_PHASE_START } from "../body-constants.js";
import { BODY_PHASE_STATIC } from "../body-constants.js";

/** Runs body animation phases for intro, content, or cleanup. */
export async function bodyAnimationPlay(phase) {
  if (phase === BODY_PHASE_START) {
    bodyAnimateForStart();
    return;
  }

  if (phase === BODY_PHASE_LOGO) {
    await bodyAnimateForLogo();
    return;
  }

  if (phase === BODY_PHASE_EXTENSION_FRAME) {
    await bodyAnimateForExtensionFrame();
    return;
  }

  if (phase === BODY_PHASE_HEADER) {
    await bodyAnimateForHeader();
    return;
  }

  if (phase === BODY_PHASE_CONTENT) {
    await bodyAnimateForSignedOutContent();
    return;
  }

  if (phase === BODY_PHASE_SIGNED_IN_CONTENT) {
    await bodyAnimateForSignedInContent();
    return;
  }

  if (phase === BODY_PHASE_STATIC) {
    bodyAnimateForSignedOutStatic();
    return;
  }

  if (phase === BODY_PHASE_FINISH) {
    bodyAnimateForFinish();
  }
}
