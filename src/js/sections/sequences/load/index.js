import { bodyAnimationFinish } from "../../body/index.js";
import { bodyAnimationPrepare } from "../../body/index.js";
import { bodyAnimationRun } from "../../body/index.js";
import { headerAnimationFinish } from "../../header/index.js";
import { headerAnimationPrepare } from "../../header/index.js";
import { headerAnimationRun } from "../../header/index.js";
import { searchAnimationFinish } from "../../search/index.js";
import { searchAnimationPrepare } from "../../search/index.js";
import { searchAnimationRun } from "../../search/index.js";
import { introAnimationFinish } from "./animations/finish.js";
import { introAnimationLogo } from "./animations/logo-fade.js";
import { introAnimationShrinkBody } from "./animations/shrink-body.js";
import { introAnimationShrinkFrame } from "./animations/shrink-frame.js";
import { introAnimationShrinkHeader } from "./animations/shrink-header.js";
import { introAnimationShrinkSearch } from "./animations/shrink-search.js";

import { INTRO_ACTIVE_CLASS } from "../constants.js";
import { INTRO_ROOT_SELECTOR } from "../constants.js";

/** Runs the one-time load sequence after bootstrap restore has finished. */
async function loadAnimationRun(isSignedIn) {
  const intro = document.querySelector(INTRO_ROOT_SELECTOR);

  if (!intro) {
    headerAnimationFinish();
    bodyAnimationFinish();
    searchAnimationFinish();
    return;
  }

  intro.classList.add(INTRO_ACTIVE_CLASS);
  headerAnimationPrepare("load");

  try {
    await introAnimationLogo();

    bodyAnimationPrepare("load");

    await introAnimationShrinkFrame();
    await introAnimationShrinkHeader();
    await headerAnimationRun("load");

    if (isSignedIn) {
      searchAnimationPrepare("load");
      await introAnimationShrinkSearch();
      await searchAnimationRun("load");
    }

    await introAnimationShrinkBody();
    introAnimationFinish();
    await bodyAnimationRun("load");
  } catch {
    headerAnimationFinish();
    bodyAnimationFinish();
    searchAnimationFinish();
    introAnimationFinish();
  }
}

export { loadAnimationRun };
export { introAnimationFinish };
