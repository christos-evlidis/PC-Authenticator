import { THEME_LIGHT_KEY } from "../../../const/const.theme.js";
import { themeStorageClear } from "../storage/clear.js";
import { themeStateGet } from "../state/get.js";
import { themeActionSet } from "./set.js";

export async function themeActionClear(options = {}) {
  themeStorageClear();
  if (themeStateGet()) {
    themeActionSet(THEME_LIGHT_KEY);
  }
}
