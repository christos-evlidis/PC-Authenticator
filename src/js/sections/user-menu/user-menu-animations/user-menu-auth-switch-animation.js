import { cssMs } from "../../../utils/utility-animation.js";
import { waitForTransitionEnd } from "../../../utils/utility-animation.js";
import { USER_MENU_AUTH_SIGN_IN_CLASS } from "../user-menu-constants.js";
import { USER_MENU_AUTH_SIGN_UP_CLASS } from "../user-menu-constants.js";
import { USER_MENU_ANIMATION_TIMEOUT_BUFFER_MS } from "../user-menu-constants.js";
import { USER_MENU_VAR_AUTH_THUMB_MS } from "../user-menu-constants.js";
import { USER_MENU_AUTH_THUMB_SELECTOR } from "../user-menu-constants.js";
import { USER_MENU_AUTH_TRACK_SELECTOR } from "../user-menu-constants.js";
import { USER_MENU_AUTH_VIEW_SIGN_UP } from "../user-menu-constants.js";

// Runs the auth switch thumb between the sign-in and sign-up positions.
export async function userMenuAuthSwitchAnimation(authView) {
  const track = document.querySelector(USER_MENU_AUTH_TRACK_SELECTOR);
  const thumb = document.querySelector(USER_MENU_AUTH_THUMB_SELECTOR);

  if (!track || !thumb) {
    return;
  }

  const isSignUp = authView === USER_MENU_AUTH_VIEW_SIGN_UP;

  track.classList.toggle(USER_MENU_AUTH_SIGN_IN_CLASS, !isSignUp);
  track.classList.toggle(USER_MENU_AUTH_SIGN_UP_CLASS, isSignUp);

  await waitForTransitionEnd(
    thumb,
    "transform",
    cssMs(track, USER_MENU_VAR_AUTH_THUMB_MS) + USER_MENU_ANIMATION_TIMEOUT_BUFFER_MS,
  );
}
