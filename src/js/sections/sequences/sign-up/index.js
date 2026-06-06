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
import { signUpAnimationFinish } from "./animations/finish.js";
import { signUpAnimationShrinkBody } from "./animations/shrink-body.js";
import { signUpAnimationShrinkSearch } from "./animations/shrink-search.js";
import { signUpAnimationMount } from "./mount.js";
import { signUpAnimationUnmount } from "./mount.js";
import { signUpAnimationPendingClear } from "./state.js";
import { signUpAnimationPendingIs } from "./state.js";
import { signUpAnimationPendingSet } from "./state.js";

import { INTRO_ACTIVE_CLASS } from "../constants.js";
import { INTRO_FRAME_SELECTOR } from "../constants.js";
import { INTRO_OVERLAY_SELECTOR } from "../constants.js";
import { INTRO_ROOT_SELECTOR } from "../constants.js";
import { INTRO_SEARCH_SELECTOR } from "../constants.js";
import { INTRO_SIGN_UP_STAGED_CLASS } from "../constants.js";
import { INTRO_VAR_HEIGHT } from "../constants.js";
import { INTRO_VAR_LEFT } from "../constants.js";
import { INTRO_VAR_TOP } from "../constants.js";
import { INTRO_VAR_WIDTH } from "../constants.js";

/** Covers search and body behind the overlay while the user menu stays open. */
async function signUpAnimationPrepare() {
  searchAnimationPrepare("sign-in");
  signUpAnimationMount();

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
  signUpAnimationPendingSet();
}

/** Runs the post-sign-up reveal after the user menu closes. */
async function signUpAnimationRun() {
  if (!signUpAnimationPendingIs()) {
    return;
  }

  signUpAnimationPendingClear();

  const intro = document.querySelector(INTRO_ROOT_SELECTOR);

  if (!intro) {
    headerAnimationFinish();
    searchAnimationFinish();
    bodyAnimationFinish();
    return;
  }

  intro.classList.remove(INTRO_SIGN_UP_STAGED_CLASS);

  try {
    await headerAnimationRun("sign-in");
    await signUpAnimationShrinkSearch();
    await searchAnimationRun("sign-in");
    await signUpAnimationShrinkBody();
    signUpAnimationFinish();
    await bodyAnimationRun("sign-in");
  } catch {
    headerAnimationFinish();
    searchAnimationFinish();
    bodyAnimationFinish();
    signUpAnimationFinish();
  }
}

/** Cancels a staged post-sign-up intro when the user signs out before closing the menu. */
function signUpAnimationCancel() {
  if (!signUpAnimationPendingIs()) {
    return;
  }

  signUpAnimationPendingClear();
  signUpAnimationUnmount();
  headerAnimationFinish();
  searchAnimationFinish();
  bodyAnimationFinish();
}

export { signUpAnimationPrepare };
export { signUpAnimationRun };
export { signUpAnimationCancel };
export { signUpAnimationFinish };
export { signUpAnimationPendingClear };
export { signUpAnimationPendingIs };
export { signUpAnimationPendingSet };
