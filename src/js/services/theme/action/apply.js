import { THEME_DARK_KEY, THEME_LIGHT_KEY } from "../../../const/const.theme.js";
import { themeStateGet } from "../state/get.js";
import { themeStorageSet } from "../storage/set.js";
import { themeActionSet } from "./set.js";
import { themeAnimationSwitch } from "../animation/switch.js";

export function themeActionApply(theme, options = {}) {
  const { instant = false } = options;
  const currentTheme = themeStateGet();
  if (currentTheme === theme && !instant) {
    themeStorageSet(theme);
    themeActionSet(theme);
    return theme;
  }
  if (instant) {
    themeActionSet(theme);
  } else {
    if (theme === THEME_DARK_KEY) {
      void themeAnimationSwitch(theme);
    } else if (theme === THEME_LIGHT_KEY) {
      void themeAnimationSwitch(theme);
    }
  }
  themeStorageSet(theme);
  return theme;
}
