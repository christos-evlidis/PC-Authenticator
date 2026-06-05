import { bodyAnimateForSignedInContent } from "./signed-in-content.js";
import { bodyAnimateForSignedOutContent } from "./signed-out-content.js";
import { bodyAnimateForExtensionFrame } from "./extension-frame.js";
import { bodyAnimateForFinish } from "./finish.js";
import { bodyAnimateForHeader } from "./header.js";
import { bodyAnimateForLogo } from "./logo.js";
import { bodyAnimateForStart } from "./start.js";
import { BODY_PHASE_EXTENSION_FRAME } from "../constants.js";
import { BODY_PHASE_FINISH } from "../constants.js";
import { BODY_PHASE_HEADER } from "../constants.js";
import { BODY_PHASE_LOGO } from "../constants.js";
import { BODY_PHASE_SIGNED_IN_CONTENT } from "../constants.js";
import { BODY_PHASE_SIGNED_OUT_CONTENT } from "../constants.js";
import { BODY_PHASE_START } from "../constants.js";

/** Runs a body animation phase. */
export async function bodyAnimationPlay(phase, options = {}) {
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

  if (phase === BODY_PHASE_SIGNED_OUT_CONTENT) {
    await bodyAnimateForSignedOutContent(options);
    return;
  }

  if (phase === BODY_PHASE_SIGNED_IN_CONTENT) {
    await bodyAnimateForSignedInContent(options);
    return;
  }

  if (phase === BODY_PHASE_FINISH) {
    bodyAnimateForFinish();
  }
}
