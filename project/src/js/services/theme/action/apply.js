import { THEME_DARK_KEY, THEME_LIGHT_KEY } from "../../../const/const.theme.js";
import { themeStateGet } from "../state/get.js";
import { themeStorageSet } from "../storage/set.js";
import { themeActionSet } from "./set.js";

export function themeActionApply(theme, options = {}) {
  themeActionSet(theme);
  themeStorageSet(theme);
  return theme;
}
