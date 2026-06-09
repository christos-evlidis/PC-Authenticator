import { animCssMsGet } from "../../../utils/utility-animation.js";
import { animDelay } from "../../../utils/utility-animation.js";
import { animFrameWait } from "../../../utils/utility-animation.js";

import { HEADER_BUTTON_SELECTOR } from "../constants.js";
import { HEADER_HIDDEN_CLASS } from "../constants.js";
import { HEADER_ICON_POP_PENDING_CLASS } from "../constants.js";
import { HEADER_ICON_POP_REVEALED_CLASS } from "../constants.js";
import { HEADER_ROOT_SELECTOR } from "../constants.js";
import { HEADER_VAR_ANIMATION_TIMEOUT_BUFFER_MS } from "../constants.js";
import { HEADER_VAR_ICON_POP_MS } from "../constants.js";
import { HEADER_VAR_ICON_POP_STAGGER_MS } from "../constants.js";
import { HEADER_VIEW_SELECTOR } from "../constants.js";

/** Pops each visible header icon in with a staggered scale animation. */
async function headerAnimationIconPop() {
  const header = document.querySelector(HEADER_ROOT_SELECTOR);

  if (!header) {
    return;
  }

  const popMs = animCssMsGet(header, HEADER_VAR_ICON_POP_MS);
  const staggerMs = animCssMsGet(header, HEADER_VAR_ICON_POP_STAGGER_MS);
  const timeoutBufferMs = animCssMsGet(header, HEADER_VAR_ANIMATION_TIMEOUT_BUFFER_MS);
  const buttons = [...document.querySelectorAll(HEADER_VIEW_SELECTOR)]
    .filter((view) => !view.classList.contains(HEADER_HIDDEN_CLASS))
    .flatMap((view) => [...view.querySelectorAll(HEADER_BUTTON_SELECTOR)]);

  for (const [index, button] of buttons.entries()) {
    if (index > 0) {
      await animDelay(staggerMs);
    }

    button.classList.remove(HEADER_ICON_POP_PENDING_CLASS);
    await animFrameWait();
    button.classList.add(HEADER_ICON_POP_REVEALED_CLASS);
    await animDelay(popMs + timeoutBufferMs);
  }
}

export { headerAnimationIconPop };
