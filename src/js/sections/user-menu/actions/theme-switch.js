import { themePersist } from "../../../utils/utility-theme.js";
import { THEME_DARK } from "../../../utils/utility-theme.js";
import { THEME_LIGHT } from "../../../utils/utility-theme.js";
import { USER_MENU_ACTIVE_CLASS } from "../constants.js";
import { USER_MENU_THEME_BTN_SELECTOR } from "../constants.js";
import { userMenuStateGet } from "../state.js";
import { userMenuStateSet } from "../state.js";
import { userMenuThemeSwitchAnimation } from "../animations/theme-switch.js";

// Switches the user menu between light and dark theme.
export async function userMenuThemeSwitch(theme) {
  const nextTheme = theme === THEME_DARK ? THEME_DARK : THEME_LIGHT;

  if (userMenuStateGet().theme === nextTheme) {
    return;
  }

  await themePersist(nextTheme);
  userMenuStateSet({ theme: nextTheme });

  document.querySelectorAll(USER_MENU_THEME_BTN_SELECTOR).forEach((button) => {
    button.classList.toggle(USER_MENU_ACTIVE_CLASS, button.dataset.theme === nextTheme);
  });

  void userMenuThemeSwitchAnimation(nextTheme);
}
