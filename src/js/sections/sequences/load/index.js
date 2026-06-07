import { bodyAnimationFinish } from "../../body/index.js";
import { bodyAnimationPrepare } from "../../body/index.js";
import { bodyAnimationRun } from "../../body/index.js";
import { headerAnimationFinish } from "../../header/index.js";
import { headerAnimationPrepare } from "../../header/index.js";
import { headerAnimationRun } from "../../header/index.js";
import { searchAnimationFinish } from "../../search/index.js";
import { searchAnimationPrepare } from "../../search/index.js";
import { searchAnimationRun } from "../../search/index.js";
import { loadAnimationFinish } from "./animations/finish.js";
import { loadAnimationLogo } from "./animations/logo-fade.js";
import { loadAnimationShrinkBody } from "./animations/shrink-body.js";
import { loadAnimationShrinkFrame } from "./animations/shrink-frame.js";
import { loadAnimationShrinkHeader } from "./animations/shrink-header.js";
import { loadAnimationShrinkSearch } from "./animations/shrink-search.js";

import { INTRO_ACTIVE_CLASS } from "../constants.js";
import { INTRO_ROOT_SELECTOR } from "../constants.js";

/** Runs the one-time load sequence after bootstrap restore has finished. */
async function loadAnimationRun(isSignedIn) {
  const intro = document.querySelector(INTRO_ROOT_SELECTOR);

  if (!intro) {
    return;
  }

  intro.classList.add(INTRO_ACTIVE_CLASS);
  headerAnimationPrepare("load");

  await loadAnimationLogo();

  bodyAnimationPrepare("load");

  await loadAnimationShrinkFrame();
  await loadAnimationShrinkHeader();
  await headerAnimationRun("load");

  if (isSignedIn) {
    searchAnimationPrepare("load");
    await loadAnimationShrinkSearch();
    await searchAnimationRun("load");
  }

  await loadAnimationShrinkBody();
  loadAnimationFinish();
  await bodyAnimationRun("load");
}

export { loadAnimationRun };
export { loadAnimationFinish };
