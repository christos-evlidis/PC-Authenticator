import { THEME_DARK } from "../../../utils/utility-theme.js";
import { USER_MENU_ACTIVE_CLASS } from "../user-menu-constants.js";
import { USER_MENU_THEME_BTN_SELECTOR } from "../user-menu-constants.js";
import { USER_MENU_THEME_DARK_CLASS } from "../user-menu-constants.js";
import { USER_MENU_THEME_LIGHT_CLASS } from "../user-menu-constants.js";
import { USER_MENU_THEME_TRACK_SELECTOR } from "../user-menu-constants.js";

/** Updates light vs dark theme switch labels in the DOM. */
export function userMenuThemeButtonsApply(theme) {
  document.querySelectorAll(USER_MENU_THEME_BTN_SELECTOR).forEach((button) => {
    button.classList.toggle(USER_MENU_ACTIVE_CLASS, button.dataset.theme === theme);
  });
}

/** Updates theme switch track classes for the active light vs dark thumb position. */
export function userMenuThemeTrackApply(theme) {
  const track = document.querySelector(USER_MENU_THEME_TRACK_SELECTOR);
  const isDark = theme === THEME_DARK;

  track?.classList.toggle(USER_MENU_THEME_LIGHT_CLASS, !isDark);
  track?.classList.toggle(USER_MENU_THEME_DARK_CLASS, isDark);
}
