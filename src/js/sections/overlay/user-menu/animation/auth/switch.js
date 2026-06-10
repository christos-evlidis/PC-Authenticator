import { animCssMsGet } from "../../../../../utils/utility-animation.js";
import { animTransitionEndWait } from "../../../../../utils/utility-animation.js";

import { USER_MENU_AUTH_SIGN_IN_CLASS } from "../../user-menu-const.js";
import { USER_MENU_AUTH_SIGN_UP_CLASS } from "../../user-menu-const.js";
import { USER_MENU_AUTH_THUMB_SELECTOR } from "../../user-menu-const.js";
import { USER_MENU_AUTH_TRACK_SELECTOR } from "../../user-menu-const.js";
import { USER_MENU_AUTH_VIEW_SIGN_UP } from "../../user-menu-const.js";
import { USER_MENU_VAR_ANIMATION_TIMEOUT_BUFFER_MS } from "../../user-menu-const.js";
import { USER_MENU_VAR_AUTH_THUMB_MS } from "../../user-menu-const.js";

/** Animates the auth view switch thumb to sign-in or sign-up. */
async function userMenuAnimationAuthSwitch(authView) {
  const track = document.querySelector(USER_MENU_AUTH_TRACK_SELECTOR);
  const thumb = document.querySelector(USER_MENU_AUTH_THUMB_SELECTOR);

  if (!track || !thumb) {
    return;
  }

  const isSignUp = authView === USER_MENU_AUTH_VIEW_SIGN_UP;

  track.classList.toggle(USER_MENU_AUTH_SIGN_IN_CLASS, !isSignUp);
  track.classList.toggle(USER_MENU_AUTH_SIGN_UP_CLASS, isSignUp);

  await animTransitionEndWait(
    thumb,
    "transform",
    animCssMsGet(track, USER_MENU_VAR_AUTH_THUMB_MS) + animCssMsGet(track, USER_MENU_VAR_ANIMATION_TIMEOUT_BUFFER_MS),
  );
}

export { userMenuAnimationAuthSwitch };
