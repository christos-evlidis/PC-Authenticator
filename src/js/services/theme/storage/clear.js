import { THEME_STORAGE_KEY } from "../theme-const.js";

export function themeStorageClear() {
  localStorage.removeItem(THEME_STORAGE_KEY);
}
