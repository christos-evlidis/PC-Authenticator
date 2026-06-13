import { THEME_TRANSITION_CLASS } from "../../../const/const.theme.js";
import { themeActionSet } from "../action/set.js";
import { animCssMsGet, animDelay } from "../../../utils/utility-animation.js";
import { VAR_BUFFER_MS, VAR_THEME_TRANSITION_MS } from "../../../const/const.utility.js";

export async function themeAnimationSwitch(theme) {
  document.body.classList.add(THEME_TRANSITION_CLASS);
  void document.body.offsetWidth;

  themeActionSet(theme);

  const themeTransitionMs = animCssMsGet(document.body, VAR_THEME_TRANSITION_MS);
  const timeoutBufferMs = animCssMsGet(document.body, VAR_BUFFER_MS);
  await animDelay(themeTransitionMs + timeoutBufferMs);
  document.body.classList.remove(THEME_TRANSITION_CLASS);
}
