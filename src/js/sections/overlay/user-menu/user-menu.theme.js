import { THEME_DARK, THEME_LIGHT, themeGet, themePersist } from "../../../utils/utility-theme.js";
import { userMenuDomGet } from "./user-menu.dom.js";
import { userMenuStateGet, userMenuStateSet } from "./user-menu.state.js";
import { userMenuAnimationThemeThumb } from "./user-menu.animation.js";
import { USER_MENU_ACTIVE_CLASS, USER_MENU_THEME_DARK_CLASS, USER_MENU_THEME_LIGHT_CLASS } from "./user-menu.constants.js";

function userMenuThemeApply(theme) {
  const dom = userMenuDomGet();
  const isDark = theme === THEME_DARK;

  dom.themeBtns.forEach((button) => {
    button.classList.toggle(USER_MENU_ACTIVE_CLASS, button.dataset.theme === theme);
  });

  dom.themeTrack?.classList.toggle(USER_MENU_THEME_LIGHT_CLASS, !isDark);
  dom.themeTrack?.classList.toggle(USER_MENU_THEME_DARK_CLASS, isDark);
}

function userMenuThemeSet(theme) {
  userMenuStateSet({ theme });
  userMenuThemeApply(theme);
}

async function userMenuUpdateTheme(theme) {
  const nextTheme = theme === THEME_DARK ? THEME_DARK : THEME_LIGHT;

  if (userMenuStateGet().theme === nextTheme) {
    return;
  }

  await themePersist(nextTheme);
  userMenuThemeSet(nextTheme);
  void userMenuAnimationThemeThumb(nextTheme);
}

function userMenuThemeSyncFromChrome() {
  userMenuThemeSet(themeGet());
}

export { userMenuThemeApply };
export { userMenuThemeSyncFromChrome };
export { userMenuUpdateTheme };
