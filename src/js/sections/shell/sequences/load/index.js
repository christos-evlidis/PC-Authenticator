import { bodyAnimationInstant } from "../../body/animation/instant.js";
import { bodyAnimationReset } from "../../body/animation/reset.js";
import { bodyAnimationStart } from "../../body/animation/start.js";
import { headerAnimationInstant } from "../../header/animation/instant.js";
import { headerAnimationReset } from "../../header/animation/reset.js";
import { headerAnimationStart } from "../../header/animation/start.js";
import { loadAnimationFinish } from "./animation/finish.js";
import { loadAnimationLogo } from "./animation/logo-fade.js";
import { loadAnimationShrinkBody } from "./animation/shrink-body.js";
import { loadAnimationShrinkFrame } from "./animation/shrink-frame.js";
import { loadAnimationShrinkHeader } from "./animation/shrink-header.js";
import { loadAnimationShrinkSearch } from "./animation/shrink-search.js";
import { searchAnimationInstant } from "../../search/animation/instant.js";
import { searchAnimationPrepare } from "../../search/index.js";
import { searchAnimationRun } from "../../search/index.js";

import { INTRO_ACTIVE_CLASS } from "../constants.js";
import { INTRO_ROOT_SELECTOR } from "../constants.js";

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
