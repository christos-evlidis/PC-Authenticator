import { headerAnimationFinish } from "../sections/header/index.js";
import { headerAnimationPrepare } from "../sections/header/index.js";
import { headerAnimationRun } from "../sections/header/index.js";
import { checkAuth } from "../utils/utility-auth.js";
import { introAnimationFinish } from "./animations/finish.js";
import { introAnimationLogo } from "./animations/logo-fade.js";
import { introAnimationShrinkBody } from "./animations/shrink-body.js";
import { introAnimationShrinkFrame } from "./animations/shrink-frame.js";
import { introAnimationShrinkHeader } from "./animations/shrink-header.js";
import { introAnimationShrinkSearch } from "./animations/shrink-search.js";
import { INTRO_ACTIVE_CLASS } from "./constants.js";
import { INTRO_ROOT_SELECTOR } from "./constants.js";

/** Runs the one-time load intro sequence. */
export async function introAnimationRun() {
  const intro = document.querySelector(INTRO_ROOT_SELECTOR);

  if (!intro) {
    headerAnimationFinish();
    return;
  }

  const authPromise = checkAuth();

  intro.classList.add(INTRO_ACTIVE_CLASS);
  headerAnimationPrepare();

  try {
    const [isSignedIn] = await Promise.all([authPromise, introAnimationLogo()]);

    await introAnimationShrinkFrame();
    await introAnimationShrinkHeader();
    await headerAnimationRun();

    if (isSignedIn) {
      await introAnimationShrinkSearch();
    }

    await introAnimationShrinkBody();
    introAnimationFinish();
  } catch {
    headerAnimationFinish();
    introAnimationFinish();
  }
}
