import { cssMs } from "../../../utils/utility-animation.js";
import { delay } from "../../../utils/utility-animation.js";
import { waitForNextFrame } from "../../../utils/utility-animation.js";
import { BODY_ICON_POP_PENDING_CLASS } from "../constants.js";
import { BODY_ICON_POP_REVEALED_CLASS } from "../constants.js";
import { BODY_ICON_SELECTOR } from "../constants.js";
import { BODY_ROOT_SELECTOR } from "../constants.js";
import { BODY_VAR_ANIMATION_TIMEOUT_BUFFER_MS } from "../constants.js";
import { BODY_VAR_ICON_POP_MS } from "../constants.js";

/** Pops the body empty-state icon into view. */
export async function bodyAnimationIconPop(content) {
  const body = document.querySelector(BODY_ROOT_SELECTOR);
  const icon = content?.querySelector(BODY_ICON_SELECTOR);

  if (!body || !icon) {
    return;
  }

  const popMs = cssMs(body, BODY_VAR_ICON_POP_MS);
  const timeoutBufferMs = cssMs(body, BODY_VAR_ANIMATION_TIMEOUT_BUFFER_MS);

  icon.classList.remove(BODY_ICON_POP_PENDING_CLASS);
  await waitForNextFrame();
  icon.classList.add(BODY_ICON_POP_REVEALED_CLASS);
  await delay(popMs + timeoutBufferMs);
}
