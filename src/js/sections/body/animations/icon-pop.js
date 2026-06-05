import { animCssMsGet } from "../../../utils/utility-animation.js";
import { animDelay } from "../../../utils/utility-animation.js";
import { animFrameWait } from "../../../utils/utility-animation.js";

import { BODY_ICON_POP_PENDING_CLASS } from "../constants.js";
import { BODY_ICON_POP_REVEALED_CLASS } from "../constants.js";
import { BODY_ICON_SELECTOR } from "../constants.js";
import { BODY_ROOT_SELECTOR } from "../constants.js";
import { BODY_VAR_ANIMATION_TIMEOUT_BUFFER_MS } from "../constants.js";
import { BODY_VAR_ICON_POP_MS } from "../constants.js";

/** Pops the body empty-state icon into view. */
async function bodyAnimationIconPop(content) {
  const body = document.querySelector(BODY_ROOT_SELECTOR);
  const icon = content?.querySelector(BODY_ICON_SELECTOR);

  if (!body || !icon) {
    return;
  }

  const popMs = animCssMsGet(body, BODY_VAR_ICON_POP_MS);
  const timeoutBufferMs = animCssMsGet(body, BODY_VAR_ANIMATION_TIMEOUT_BUFFER_MS);

  icon.classList.remove(BODY_ICON_POP_PENDING_CLASS);
  await animFrameWait();
  icon.classList.add(BODY_ICON_POP_REVEALED_CLASS);
  await animDelay(popMs + timeoutBufferMs);
}

export { bodyAnimationIconPop };
