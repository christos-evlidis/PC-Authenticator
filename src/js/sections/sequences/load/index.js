import { bodyAnimationInstant } from "../../body/index.js";
import { bodyAnimationReset } from "../../body/index.js";
import { bodyAnimationStart } from "../../body/index.js";
import { headerAnimationInstant } from "../../header/index.js";
import { headerAnimationReset } from "../../header/index.js";
import { headerAnimationStart } from "../../header/index.js";
import { searchAnimationInstant } from "../../search/index.js";
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

/** Runs the one-time load sequence after bootstrap accountsRestore has finished. */
async function loadAnimationRun(isSignedIn, options = {}) {
  const { skipIntro = false } = options;
  const intro = document.querySelector(INTRO_ROOT_SELECTOR);

  if (!intro) {
    return;
  }

  if (skipIntro) {
    loadAnimationFinish();
    headerAnimationInstant();
    bodyAnimationInstant();

    if (isSignedIn) {
      searchAnimationInstant();
    }

    return;
  }

  intro.classList.add(INTRO_ACTIVE_CLASS);
  headerAnimationReset();

  await loadAnimationLogo();

  bodyAnimationReset();

  await loadAnimationShrinkFrame();
  await loadAnimationShrinkHeader();
  await headerAnimationStart();

  if (isSignedIn) {
    searchAnimationPrepare("load");
    await loadAnimationShrinkSearch();
    await searchAnimationRun("load");
  }

  await loadAnimationShrinkBody();
  loadAnimationFinish();
  await bodyAnimationStart();
}

export { loadAnimationRun };
export { loadAnimationFinish };
