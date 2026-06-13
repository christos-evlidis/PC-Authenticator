import { THEME_STORAGE_KEY } from "../../../const/const.theme.js";
import { themeParse } from "../parse/parse.js";

export function themeStorageGet() {
  return themeParse(localStorage.getItem(THEME_STORAGE_KEY));
}
