import { cssMs } from "../../../utils/utility-animation.js";
import { waitForNextFrame } from "../../../utils/utility-animation.js";
import { waitForTransitionEnd } from "../../../utils/utility-animation.js";
import { BODY_ANIMATION_TIMEOUT_BUFFER_MS } from "../constants.js";
import { BODY_ANIMATE_FOR_EXTENSION_FRAME_CLASS } from "../constants.js";
import { BODY_ROOT_SELECTOR } from "../constants.js";
import { BODY_VAR_ANIMATE_FOR_EXTENSION_FRAME_MS } from "../constants.js";

/** Shrinks the body inset from all sides during the extension-frame phase. */
export async function bodyAnimateForExtensionFrame() {
  const body = document.querySelector(BODY_ROOT_SELECTOR);
  const extensionFrameMs = cssMs(body, BODY_VAR_ANIMATE_FOR_EXTENSION_FRAME_MS);

  if (!body) {
    return;
  }

  body.classList.add(BODY_ANIMATE_FOR_EXTENSION_FRAME_CLASS);
  await waitForNextFrame();
  await waitForTransitionEnd(
    body,
    "top",
    extensionFrameMs + BODY_ANIMATION_TIMEOUT_BUFFER_MS,
  );
}
