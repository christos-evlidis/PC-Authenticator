export { introAnimationFinish } from "./animations/finish.js";
export { introSignInAnimationFinish } from "./animations/finish.js";

import { bodyAnimationFinish } from "../body/index.js";
import { bodyAnimationPrepare } from "../body/index.js";
import { bodyAnimationRun } from "../body/index.js";
import { headerAnimationFinish } from "../header/index.js";
import { headerAnimationPrepare } from "../header/index.js";
import { headerAnimationRun } from "../header/index.js";
import { searchAnimationFinish } from "../search/index.js";
import { searchAnimationPrepare } from "../search/index.js";
import { searchAnimationRun } from "../search/index.js";
import { frameMetrics } from "../../utils/utility-animation.js";
import { checkAuth } from "../../utils/utility-auth.js";
import { introAnimationFinish } from "./animations/finish.js";
import { introSignInAnimationFinish } from "./animations/finish.js";
import { introAnimationLogo } from "./animations/logo-fade.js";
import { introAnimationShrinkBody } from "./animations/shrink-body.js";
import { introAnimationShrinkFrame } from "./animations/shrink-frame.js";
import { introAnimationShrinkHeader } from "./animations/shrink-header.js";
import { introAnimationShrinkSearch } from "./animations/shrink-search.js";
import { INTRO_ACTIVE_CLASS } from "./constants.js";
import { INTRO_FRAME_SELECTOR } from "./constants.js";
import { INTRO_HEADER_SELECTOR } from "./constants.js";
import { INTRO_OVERLAY_SELECTOR } from "./constants.js";
import { INTRO_ROOT_SELECTOR } from "./constants.js";
import { INTRO_VAR_HEIGHT } from "./constants.js";
import { INTRO_VAR_LEFT } from "./constants.js";
import { INTRO_VAR_TOP } from "./constants.js";
import { INTRO_VAR_WIDTH } from "./constants.js";
import { introAnimationMountForSignIn } from "./mount.js";
import { introAnimationUnmountForSignIn } from "./mount.js";
import {
  introSignInAnimationClearPending,
  introSignInAnimationIsPending,
  introSignInAnimationStage,
} from "./state.js";

/** Runs the one-time load intro sequence. */
export async function introLoadAnimationRun() {
  const intro = document.querySelector(INTRO_ROOT_SELECTOR);

  if (!intro) {
    headerAnimationFinish();
    bodyAnimationFinish();
    searchAnimationFinish();
    return;
  }

  const authPromise = checkAuth();

  intro.classList.add(INTRO_ACTIVE_CLASS);
  headerAnimationPrepare();

  try {
    const [isSignedIn] = await Promise.all([authPromise, introAnimationLogo()]);

    bodyAnimationPrepare();

    await introAnimationShrinkFrame();
    await introAnimationShrinkHeader();
    await headerAnimationRun();

    if (isSignedIn) {
      searchAnimationPrepare();
      await introAnimationShrinkSearch();
      await searchAnimationRun();
    }

    await introAnimationShrinkBody();
    introAnimationFinish();
    await bodyAnimationRun();
  } catch {
    headerAnimationFinish();
    bodyAnimationFinish();
    searchAnimationFinish();
    introAnimationFinish();
  }
}

/** Hides signed-in chrome behind the overlay until the menu closes. */
export function introSignInAnimationPrepare() {
  introAnimationMountForSignIn();

  const overlay = document.querySelector(INTRO_OVERLAY_SELECTOR);
  const frame = document.querySelector(INTRO_FRAME_SELECTOR);
  const header = document.querySelector(INTRO_HEADER_SELECTOR);

  if (overlay && frame && header) {
    const { padLeft, gap, bottomAnchor, insetWidth } = frameMetrics(frame);
    const frameRect = frame.getBoundingClientRect();
    const headerRect = header.getBoundingClientRect();
    const top = headerRect.bottom - frameRect.top + gap;

    overlay.style.setProperty(INTRO_VAR_TOP, `${top}px`);
    overlay.style.setProperty(INTRO_VAR_LEFT, `${padLeft}px`);
    overlay.style.setProperty(INTRO_VAR_WIDTH, `${insetWidth}px`);
    overlay.style.setProperty(INTRO_VAR_HEIGHT, `${bottomAnchor - top}px`);
  }

  headerAnimationPrepare();
  searchAnimationPrepare();
  bodyAnimationPrepare();
  introSignInAnimationStage();
}

/** Runs the post-sign-in reveal after the user menu closes. */
export async function introSignInAnimationRun() {
  if (!introSignInAnimationIsPending()) {
    return;
  }

  introSignInAnimationClearPending();

  const intro = document.querySelector(INTRO_ROOT_SELECTOR);

  if (!intro) {
    headerAnimationFinish();
    searchAnimationFinish();
    bodyAnimationFinish();
    return;
  }

  try {
    await headerAnimationRun();
    await introAnimationShrinkSearch();
    await searchAnimationRun();
    await introAnimationShrinkBody();
    introSignInAnimationFinish();
    await bodyAnimationRun();
  } catch {
    headerAnimationFinish();
    searchAnimationFinish();
    bodyAnimationFinish();
    introSignInAnimationFinish();
  }
}

/** Cancels a staged post-sign-in intro when the user signs out before closing the menu. */
export function introSignInAnimationCancel() {
  if (!introSignInAnimationIsPending()) {
    return;
  }

  introSignInAnimationClearPending();
  introAnimationUnmountForSignIn();
  headerAnimationFinish();
  searchAnimationFinish();
  bodyAnimationFinish();
}
