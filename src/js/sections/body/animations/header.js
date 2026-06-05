import { cssMs } from "../../../utils/utility-animation.js";
import { waitForNextFrame } from "../../../utils/utility-animation.js";
import { waitForTransitionEnd } from "../../../utils/utility-animation.js";
import { BODY_ANIMATE_FOR_HEADER_CLASS } from "../constants.js";
import { BODY_ANIMATION_TIMEOUT_BUFFER_MS } from "../constants.js";
import { BODY_ROOT_SELECTOR } from "../constants.js";
import { BODY_VAR_ANIMATE_FOR_HEADER_MS } from "../constants.js";

/** Shrinks the body from the top to leave room for the header during the header phase. */
export async function bodyAnimateForHeader() {
  const body = document.querySelector(BODY_ROOT_SELECTOR);
  const headerMs = cssMs(body, BODY_VAR_ANIMATE_FOR_HEADER_MS);

  if (!body) {
    return;
  }

  body.classList.add(BODY_ANIMATE_FOR_HEADER_CLASS);
  await waitForNextFrame();
  await waitForTransitionEnd(
    body,
    "top",
    headerMs + BODY_ANIMATION_TIMEOUT_BUFFER_MS,
  );
}
