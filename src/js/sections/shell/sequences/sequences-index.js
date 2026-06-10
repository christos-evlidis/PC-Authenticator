import { bodyAnimationInstant } from "../body/body-index.js";
import { bodyAnimationReset } from "../body/body-index.js";
import { bodyAnimationStart } from "../body/body-index.js";
import { headerAnimationInstant } from "../header/header-index.js";
import { headerAnimationReset } from "../header/header-index.js";
import { headerAnimationStart } from "../header/header-index.js";
import { loadAnimationFinish } from "./load/animation/finish.js";
import { loadAnimationLogo } from "./load/animation/logo-fade.js";
import { loadAnimationShrinkBody } from "./load/animation/shrink-body.js";
import { loadAnimationShrinkFrame } from "./load/animation/shrink-frame.js";
import { loadAnimationShrinkHeader } from "./load/animation/shrink-header.js";
import { loadAnimationShrinkSearch } from "./load/animation/shrink-search.js";
import { searchAnimationInstant } from "../search/search-index.js";
import { searchAnimationPrepare } from "../search/search-index.js";
import { searchAnimationRun } from "../search/search-index.js";

import { INTRO_ACTIVE_CLASS } from "./sequences-const.js";
import { INTRO_ROOT_SELECTOR } from "./sequences-const.js";

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

export { loadAnimationFinish } from "./load/animation/finish.js";
export { loadAnimationLogo } from "./load/animation/logo-fade.js";
export { loadAnimationShrinkBody } from "./load/animation/shrink-body.js";
export { loadAnimationShrinkFrame } from "./load/animation/shrink-frame.js";
export { loadAnimationShrinkHeader } from "./load/animation/shrink-header.js";
export { loadAnimationShrinkSearch } from "./load/animation/shrink-search.js";
