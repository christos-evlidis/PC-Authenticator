import { animCssMsGet } from "../../../utils/utility-animation.js";
import { animTransitionEndWait } from "../../../utils/utility-animation.js";

import { USER_MENU_AUTH_SIGN_IN_CLASS } from "../constants.js";
import { USER_MENU_AUTH_SIGN_UP_CLASS } from "../constants.js";
import { USER_MENU_VAR_ANIMATION_TIMEOUT_BUFFER_MS } from "../constants.js";
import { USER_MENU_VAR_AUTH_THUMB_MS } from "../constants.js";
import { USER_MENU_AUTH_THUMB_SELECTOR } from "../constants.js";
import { USER_MENU_AUTH_TRACK_SELECTOR } from "../constants.js";
import { USER_MENU_AUTH_VIEW_SIGN_UP } from "../constants.js";

/** Runs the auth switch thumb between the sign-in and sign-up positions. */
async function userMenuAuthSwitchAnimation(authView) {
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

export { userMenuAuthSwitchAnimation };
