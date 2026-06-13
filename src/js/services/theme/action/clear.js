import { THEME_LIGHT_KEY } from "../../../const/const.theme.js";
import { themeStorageClear } from "../storage/clear.js";
import { themeStateGet } from "../state/get.js";
import { themeAnimationSwitch } from "../animation/switch.js";
import { themeActionSet } from "./set.js";

export async function themeActionClear(options = {}) {
  const { instant = false } = options;
  
  themeStorageClear();

  if (themeStateGet()) {
    if (instant) {
      themeActionSet(THEME_LIGHT_KEY);
    } else {
      await themeAnimationSwitch(THEME_LIGHT_KEY);
    }
  }
}
