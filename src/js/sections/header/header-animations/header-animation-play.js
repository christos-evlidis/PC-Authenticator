import { headerAnimateForContent } from "./header-animate-for-content.js";
import { headerAnimateForFinish } from "./header-animate-for-finish.js";
import { headerAnimateForIntro } from "./header-animate-for-intro.js";
import { headerAnimateForStart } from "./header-animate-for-start.js";
import { HEADER_PHASE_CONTENT } from "../header-constants.js";
import { HEADER_PHASE_FINISH } from "../header-constants.js";
import { HEADER_PHASE_INTRO } from "../header-constants.js";
import { HEADER_PHASE_START } from "../header-constants.js";

/** Runs header animation phases for intro, content, or cleanup. */
export async function headerAnimationPlay(phase) {
  if (phase === HEADER_PHASE_START) {
    headerAnimateForStart();
    return;
  }

  if (phase === HEADER_PHASE_INTRO) {
    await headerAnimateForIntro();
    return;
  }

  if (phase === HEADER_PHASE_CONTENT) {
    await headerAnimateForContent();
    return;
  }

  if (phase === HEADER_PHASE_FINISH) {
    headerAnimateForFinish();
  }
}
