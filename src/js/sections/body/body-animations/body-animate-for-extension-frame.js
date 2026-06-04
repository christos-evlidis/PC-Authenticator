import { cssMs } from "../../../utils/utility-animation.js";
import { waitForNextFrame } from "../../../utils/utility-animation.js";
import { waitForTransitionEnd } from "../../../utils/utility-animation.js";
import { BODY_ANIMATION_TIMEOUT_BUFFER_MS } from "../body-constants.js";
import { BODY_INTRO_INSET_CLASS } from "../body-constants.js";
import { BODY_ROOT_SELECTOR } from "../body-constants.js";
import { BODY_VAR_INTRO_INSET_MS } from "../body-constants.js";

/** Shrinks the body inset from all sides during frame intro. */
export async function bodyAnimateForExtensionFrame() {
  const body = document.querySelector(BODY_ROOT_SELECTOR);
  const introInsetMs = cssMs(body, BODY_VAR_INTRO_INSET_MS);

  if (!body) {
    return;
  }

  body.classList.add(BODY_INTRO_INSET_CLASS);
  await waitForNextFrame();
  await waitForTransitionEnd(
    body,
    "top",
    introInsetMs + BODY_ANIMATION_TIMEOUT_BUFFER_MS,
  );
}
