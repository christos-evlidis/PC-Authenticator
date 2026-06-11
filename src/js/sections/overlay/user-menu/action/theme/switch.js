import { THEME_DARK } from "../../../../../utils/utility-theme.js";
import { THEME_LIGHT } from "../../../../../utils/utility-theme.js";
import { themePersist } from "../../../../../utils/utility-theme.js";
import { userMenuAnimationThemeSwitch } from "../../animation/theme/switch.js";
import { userMenuStateGet } from "../../state/get.js";
import { userMenuStateSet } from "../../state/set.js";

import { USER_MENU_ACTIVE_CLASS } from "../../user-menu-const.js";
import { USER_MENU_THEME_BTN_SELECTOR } from "../../user-menu-const.js";

/** Persists and animates a light or dark theme change. */
async function userMenuActionThemeSwitch(theme) {
  const nextTheme = theme === THEME_DARK ? THEME_DARK : THEME_LIGHT;

  if (userMenuStateGet().theme === nextTheme) {
    return;
  }

  await themePersist(nextTheme);
  userMenuStateSet({ theme: nextTheme });

  document.querySelectorAll(USER_MENU_THEME_BTN_SELECTOR).forEach((button) => {
    button.classList.toggle(USER_MENU_ACTIVE_CLASS, button.dataset.theme === nextTheme);
  });

  void userMenuAnimationThemeSwitch(nextTheme);
}

export { userMenuActionThemeSwitch };
