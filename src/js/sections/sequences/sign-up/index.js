import { bodyAnimationFinish } from "../../body/index.js";
import { bodyAnimationPrepare } from "../../body/index.js";
import { bodyAnimationRun } from "../../body/index.js";
import { bodyApply } from "../../body/index.js";
import { searchAnimationFinish } from "../../search/index.js";
import { searchAnimationPrepare } from "../../search/index.js";
import { searchAnimationRun } from "../../search/index.js";
import { animFrameMetricsGet } from "../../../utils/utility-animation.js";
import { authChromeApply } from "../../../utils/utility-auth.js";
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

/** Mounts the overlay, applies signed-in chrome, and prepares reveal animations. */
async function signUpAnimationPrepare() {
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

  document.querySelector(INTRO_ROOT_SELECTOR)?.classList.add(INTRO_ACTIVE_CLASS);
  await authChromeApply({ applyBody: false });
  bodyApply(true);
  searchAnimationPrepare("sign-in");
  await bodyAnimationPrepare("sign-in");
}

/** Runs the post-sign-up reveal after the user menu closes. */
async function signUpAnimationRun() {
  if (!signUpAnimationPendingIs()) {
    return;
  }

  signUpAnimationPendingClear();

  try {
    await bodyAnimationPrepare("sign-in-fade");
    await signUpAnimationPrepare();

    const intro = document.querySelector(INTRO_ROOT_SELECTOR);

    if (!intro) {
      searchAnimationFinish();
      bodyAnimationFinish();
      return;
    }

    intro.classList.remove(INTRO_SIGN_UP_STAGED_CLASS);

    await signUpAnimationShrinkSearch();
    await searchAnimationRun("sign-in");
    await signUpAnimationShrinkBody();
    signUpAnimationFinish();
    await bodyAnimationRun("sign-in");
  } catch {
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
