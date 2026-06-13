import { THEME_DARK_KEY, THEME_LIGHT_KEY } from "../../../const/const.theme.js";

/** Coerces any stored or requested value to light or dark. */
export function themeParse(theme) {
  return theme === THEME_LIGHT_KEY ? THEME_LIGHT_KEY : THEME_DARK_KEY;
}
