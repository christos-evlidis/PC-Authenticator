import { bodyAnimationFinish } from "../../body/index.js";
import { bodyAnimationPrepare } from "../../body/index.js";
import { bodyAnimationRun } from "../../body/index.js";
import { headerAnimationFinish } from "../../header/index.js";
import { headerAnimationPrepare } from "../../header/index.js";
import { headerAnimationRun } from "../../header/index.js";
import { searchAnimationFinish } from "../../search/index.js";
import { searchAnimationPrepare } from "../../search/index.js";
import { searchAnimationRun } from "../../search/index.js";
import { animFrameMetricsGet } from "../../../utils/utility-animation.js";
import { signInAnimationFinish } from "./animations/finish.js";
import { signInAnimationShrinkBody } from "./animations/shrink-body.js";
import { signInAnimationShrinkSearch } from "./animations/shrink-search.js";
import { signInAnimationMount } from "./mount.js";
import { signInAnimationUnmount } from "./mount.js";
import { signInAnimationPendingClear } from "./state.js";
import { signInAnimationPendingIs } from "./state.js";
import { signInAnimationPendingSet } from "./state.js";

import { INTRO_ACTIVE_CLASS } from "../constants.js";
import { INTRO_FRAME_SELECTOR } from "../constants.js";
import { INTRO_OVERLAY_SELECTOR } from "../constants.js";
import { INTRO_ROOT_SELECTOR } from "../constants.js";
import { INTRO_SEARCH_SELECTOR } from "../constants.js";
import { INTRO_SIGN_IN_STAGED_CLASS } from "../constants.js";
import { INTRO_VAR_HEIGHT } from "../constants.js";
import { INTRO_VAR_LEFT } from "../constants.js";
import { INTRO_VAR_TOP } from "../constants.js";
import { INTRO_VAR_WIDTH } from "../constants.js";

/** Covers search and body behind the overlay while the user menu stays open. */
async function signInAnimationPrepare() {
  searchAnimationPrepare("sign-in");
  signInAnimationMount();

  const overlay = document.querySelector(INTRO_OVERLAY_SELECTOR);
  const frame = document.querySelector(INTRO_FRAME_SELECTOR);
  const search = document.querySelector(INTRO_SEARCH_SELECTOR);

  if (overlay && frame) {
    const { padLeft, padTop, bottomAnchor, insetWidth } = animFrameMetricsGet(frame);
    const frameRect = frame.getBoundingClientRect();
    const searchRect = search?.getBoundingClientRect();
    const top = searchRect?.height > 0 ? searchRect.top - frameRect.top : padTop;

    overlay.style.setProperty(INTRO_VAR_TOP, `${top}px`);
    overlay.style.setProperty(INTRO_VAR_LEFT, `${padLeft}px`);
    overlay.style.setProperty(INTRO_VAR_WIDTH, `${insetWidth}px`);
    overlay.style.setProperty(INTRO_VAR_HEIGHT, `${bottomAnchor - top}px`);
  }

  const intro = document.querySelector(INTRO_ROOT_SELECTOR);

  intro?.classList.add(INTRO_ACTIVE_CLASS);
  await headerAnimationPrepare("sign-in");
  await bodyAnimationPrepare("sign-in");
  signInAnimationPendingSet();
}

/** Runs the post-sign-in reveal after the user menu closes. */
async function signInAnimationRun() {
  if (!signInAnimationPendingIs()) {
    return;
  }

  signInAnimationPendingClear();

  const intro = document.querySelector(INTRO_ROOT_SELECTOR);

  if (!intro) {
    headerAnimationFinish();
    searchAnimationFinish();
    bodyAnimationFinish();
    return;
  }

  intro.classList.remove(INTRO_SIGN_IN_STAGED_CLASS);

  try {
    await headerAnimationRun("sign-in");
    await signInAnimationShrinkSearch();
    await searchAnimationRun("sign-in");
    await signInAnimationShrinkBody();
    signInAnimationFinish();
    await bodyAnimationRun("sign-in");
  } catch {
    headerAnimationFinish();
    searchAnimationFinish();
    bodyAnimationFinish();
    signInAnimationFinish();
  }
}

/** Cancels a staged post-sign-in intro when the user signs out before closing the menu. */
function signInAnimationCancel() {
  if (!signInAnimationPendingIs()) {
    return;
  }

  signInAnimationPendingClear();
  signInAnimationUnmount();
  headerAnimationFinish();
  searchAnimationFinish();
  bodyAnimationFinish();
}

export { signInAnimationPrepare };
export { signInAnimationRun };
export { signInAnimationCancel };
export { signInAnimationFinish };
export { signInAnimationPendingClear };
export { signInAnimationPendingIs };
export { signInAnimationPendingSet };
