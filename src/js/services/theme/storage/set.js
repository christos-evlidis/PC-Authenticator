import { THEME_STORAGE_KEY } from "../../../const/const.theme.js";
import { themeParse } from "../parse/parse.js";

export function themeStorageSet(theme) {
  localStorage.setItem(THEME_STORAGE_KEY, themeParse(theme));
}
