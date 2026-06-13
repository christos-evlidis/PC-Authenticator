import { THEME_DARK_CLASS } from "../../../const/const.theme.js";

/** Returns whether dark mode is active on the body layer. */
export function themeStateGet() {
  return document.body.classList.contains(THEME_DARK_CLASS);
}
