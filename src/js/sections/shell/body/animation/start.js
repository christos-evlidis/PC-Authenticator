import { animCssMsGet } from "../../../../utils/utility-animation.js";
import { animDelay } from "../../../../utils/utility-animation.js";
import { animFrameWait } from "../../../../utils/utility-animation.js";
import { bodyAnimationFinish } from "./finish.js";

import { BODY_ANIMATION_PENDING_CLASS } from "../../../../const/const.body.js";
import { BODY_CONTENT_SIGNED_IN_SELECTOR } from "../../../../const/const.body.js";
import { BODY_CONTENT_SIGNED_OUT_SELECTOR } from "../../../../const/const.body.js";
import { BODY_HIDDEN_CLASS } from "../../../../const/const.body.js";
import { BODY_ICON_POP_PENDING_CLASS } from "../../../../const/const.body.js";
import { BODY_ICON_POP_REVEALED_CLASS } from "../../../../const/const.body.js";
import { BODY_ICON_SELECTOR } from "../../../../const/const.body.js";
import { BODY_MESSAGE_DISPLAY_SELECTOR } from "../../../../const/const.body.js";
import { BODY_MESSAGE_SPACER_SELECTOR } from "../../../../const/const.body.js";
import { BODY_MESSAGE_STACK_SELECTOR } from "../../../../const/const.body.js";
import { BODY_MESSAGE_TYPING_CLASS } from "../../../../const/const.body.js";
import { BODY_ROOT_SELECTOR } from "../../../../const/const.body.js";
import { BODY_SIGNED_IN_EMPTY_MESSAGE_TEXT } from "../../../../const/const.body.js";
import { BODY_SIGNED_IN_VIEW_SELECTOR } from "../../../../const/const.body.js";
import { BODY_SIGNED_OUT_MESSAGE_TEXT } from "../../../../const/const.body.js";
import { BODY_SIGNED_OUT_VIEW_SELECTOR } from "../../../../const/const.body.js";
import { BODY_VAR_ANIMATION_TIMEOUT_BUFFER_MS } from "../../../../const/const.body.js";
import { BODY_VAR_ICON_POP_MS } from "../../../../const/const.body.js";
import { BODY_VAR_MESSAGE_TYPE_MS } from "../../../../const/const.body.js";

async function _bodyAnimationStart() {
  const body = document.querySelector(BODY_ROOT_SELECTOR);
  const signedOutView = document.querySelector(BODY_SIGNED_OUT_VIEW_SELECTOR);
  const signedInView = document.querySelector(BODY_SIGNED_IN_VIEW_SELECTOR);
  let content = null;

  if (!signedOutView?.classList.contains(BODY_HIDDEN_CLASS)) {
    content = document.querySelector(BODY_CONTENT_SIGNED_OUT_SELECTOR);
  } else if (!signedInView?.classList.contains(BODY_HIDDEN_CLASS)) {
    content = document.querySelector(BODY_CONTENT_SIGNED_IN_SELECTOR);
  }

  if (!body) {
    return;
  }

  if (!content || !body.classList.contains(BODY_ANIMATION_PENDING_CLASS)) {
    bodyAnimationFinish();
    return;
  }

  try {
    await animDelay(animCssMsGet(body, BODY_VAR_ANIMATION_TIMEOUT_BUFFER_MS));

    const icon = content.querySelector(BODY_ICON_SELECTOR);
    const stack = content.querySelector(BODY_MESSAGE_STACK_SELECTOR);
    const spacer = content.querySelector(BODY_MESSAGE_SPACER_SELECTOR);
    const display = content.querySelector(BODY_MESSAGE_DISPLAY_SELECTOR);

    if (!icon || !stack || !spacer || !display) {
      bodyAnimationFinish();
      return;
    }

    const popMs = animCssMsGet(body, BODY_VAR_ICON_POP_MS);
    const timeoutBufferMs = animCssMsGet(body, BODY_VAR_ANIMATION_TIMEOUT_BUFFER_MS);

    icon.classList.remove(BODY_ICON_POP_PENDING_CLASS);
    await animFrameWait();
    icon.classList.add(BODY_ICON_POP_REVEALED_CLASS);
    await animDelay(popMs + timeoutBufferMs);

    const signedIn = !signedInView?.classList.contains(BODY_HIDDEN_CLASS);
    const stored = stack.dataset.fullText;
    const defaultText = signedIn
      ? BODY_SIGNED_IN_EMPTY_MESSAGE_TEXT
      : BODY_SIGNED_OUT_MESSAGE_TEXT;
    const fullText = stored ? stored.replace(/\\n/g, "\n") : defaultText;

    spacer.textContent = fullText;

    const typeMs = animCssMsGet(body, BODY_VAR_MESSAGE_TYPE_MS);
    const charCount = fullText.length;
    const stepMs = charCount > 0 ? typeMs / charCount : typeMs;

    display.textContent = "";
    display.classList.add(BODY_MESSAGE_TYPING_CLASS);

    for (let index = 0; index < charCount; index += 1) {
      display.textContent = fullText.slice(0, index + 1);
      await animDelay(stepMs);
    }

    display.classList.remove(BODY_MESSAGE_TYPING_CLASS);
    bodyAnimationFinish();
  } catch {
    bodyAnimationFinish();
  }
}

export { _bodyAnimationStart as bodyAnimationStart };
