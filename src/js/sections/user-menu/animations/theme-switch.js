import { animCssMsGet } from "../../../utils/utility-animation.js";
import { animTransitionEndWait } from "../../../utils/utility-animation.js";

import { THEME_DARK } from "../../../utils/utility-theme.js";
import { USER_MENU_THEME_DARK_CLASS } from "../constants.js";
import { USER_MENU_THEME_LIGHT_CLASS } from "../constants.js";
import { USER_MENU_VAR_ANIMATION_TIMEOUT_BUFFER_MS } from "../constants.js";
import { USER_MENU_VAR_THEME_THUMB_MS } from "../constants.js";
import { USER_MENU_THEME_THUMB_SELECTOR } from "../constants.js";
import { USER_MENU_THEME_TRACK_SELECTOR } from "../constants.js";

/** Runs the theme switch thumb between light and dark positions. */
async function userMenuThemeSwitchAnimation(theme) {
  const track = document.querySelector(USER_MENU_THEME_TRACK_SELECTOR);
  const thumb = document.querySelector(USER_MENU_THEME_THUMB_SELECTOR);

  if (!track || !thumb) {
    return;
  }

  const isDark = theme === THEME_DARK;

  track.classList.toggle(USER_MENU_THEME_LIGHT_CLASS, !isDark);
  track.classList.toggle(USER_MENU_THEME_DARK_CLASS, isDark);

  await animTransitionEndWait(
    thumb,
    "transform",
    animCssMsGet(track, USER_MENU_VAR_THEME_THUMB_MS) + animCssMsGet(track, USER_MENU_VAR_ANIMATION_TIMEOUT_BUFFER_MS),
  );
}

export { userMenuThemeSwitchAnimation };
