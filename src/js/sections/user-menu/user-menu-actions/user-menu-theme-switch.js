import { themePersist } from "../../../utils/utility-theme.js";
import { THEME_DARK } from "../../../utils/utility-theme.js";
import { THEME_LIGHT } from "../../../utils/utility-theme.js";
import { userMenuThemeButtonsApply } from "../user-menu-render/user-menu-theme.js";
import { userMenuStateGet } from "../user-menu-state.js";
import { userMenuStateSet } from "../user-menu-state.js";
import { userMenuThemeSwitchAnimation } from "../user-menu-animations/user-menu-theme-switch-animation.js";

// Switches the user menu between light and dark theme.
export async function userMenuThemeSwitch(theme) {
  const nextTheme = theme === THEME_DARK ? THEME_DARK : THEME_LIGHT;

  if (userMenuStateGet().theme === nextTheme) {
    return;
  }

  await themePersist(nextTheme);
  userMenuStateSet({ theme: nextTheme });
  userMenuThemeButtonsApply(nextTheme);
  void userMenuThemeSwitchAnimation(nextTheme);
}
