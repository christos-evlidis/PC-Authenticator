import { THEME_DARK_KEY } from "../../../const/const.theme.js";
import { themeParse } from "../parse/parse.js";
import { themeStateGet } from "../state/get.js";
import { themeStorageSet } from "../storage/set.js";
import { themeActionSet } from "./set.js";
import { themeAnimationSwitch } from "../animation/switch.js";

export function themeActionApply(theme, options = {}) {
  const { instant = false } = options;
  const resolved = themeParse(theme);
  const isDark = resolved === THEME_DARK_KEY;

  if (themeStateGet() === isDark && !instant) {
    themeStorageSet(resolved);
    themeActionSet(resolved);
    return resolved;
  }

  if (instant) {
    themeActionSet(resolved);
  } else {
    void themeAnimationSwitch(resolved);
  }

  themeStorageSet(resolved);
  return resolved;
}
