import { cssMs } from "../../../utils/utility-animation.js";
import { waitForNextFrame } from "../../../utils/utility-animation.js";
import { waitForTransitionEnd } from "../../../utils/utility-animation.js";
import { BODY_ANIMATION_TIMEOUT_BUFFER_MS } from "../constants.js";
import { BODY_INTRO_SLOT_CLASS } from "../constants.js";
import { BODY_ROOT_SELECTOR } from "../constants.js";
import { BODY_VAR_INTRO_SLOT_MS } from "../constants.js";

/** Shrinks the body from the top to reserve the header slot. */
export async function bodyAnimateForHeader() {
  const body = document.querySelector(BODY_ROOT_SELECTOR);
  const introSlotMs = cssMs(body, BODY_VAR_INTRO_SLOT_MS);

  if (!body) {
    return;
  }

  body.classList.add(BODY_INTRO_SLOT_CLASS);
  await waitForNextFrame();
  await waitForTransitionEnd(
    body,
    "top",
    introSlotMs + BODY_ANIMATION_TIMEOUT_BUFFER_MS,
  );
}
