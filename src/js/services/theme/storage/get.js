import { THEME_STORAGE_KEY } from "../theme-const.js";
import { themeParse } from "../parse/parse.js";

export function themeStorageGet() {
  return themeParse(localStorage.getItem(THEME_STORAGE_KEY));
}
