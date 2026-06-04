import { themePersist } from "../../../utils/utility-theme.js";
import { THEME_DARK } from "../../../utils/utility-theme.js";
import { THEME_LIGHT } from "../../../utils/utility-theme.js";
import { userMenuThemeButtonsApply } from "../render/theme.js";
import { userMenuStateGet } from "../state.js";
import { userMenuStateSet } from "../state.js";
import { userMenuThemeSwitchAnimation } from "../animations/theme-switch-animation.js";

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
