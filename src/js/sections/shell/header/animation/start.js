import { animCssMsGet } from "../../../../utils/utility-animation.js";
import { animDelay } from "../../../../utils/utility-animation.js";
import { animFrameWait } from "../../../../utils/utility-animation.js";
import { headerAnimationFinish } from "./finish.js";

import { HEADER_ANIMATION_PENDING_CLASS } from "../../../../const/const.header.js";
import { HEADER_BUTTON_SELECTOR } from "../../../../const/const.header.js";
import { HEADER_FADE_IN_CLASS } from "../../../../const/const.header.js";
import { HEADER_HIDDEN_CLASS } from "../../../../const/const.header.js";
import { HEADER_ICON_POP_PENDING_CLASS } from "../../../../const/const.header.js";
import { HEADER_ICON_POP_REVEALED_CLASS } from "../../../../const/const.header.js";
import { HEADER_ROOT_SELECTOR } from "../../../../const/const.header.js";
import { HEADER_TITLE_DISPLAY_SELECTOR } from "../../../../const/const.header.js";
import { HEADER_TITLE_SELECTOR } from "../../../../const/const.header.js";
import { HEADER_TITLE_TEXT } from "../../../../const/const.header.js";
import { HEADER_TITLE_TYPING_CLASS } from "../../../../const/const.header.js";
import { HEADER_VAR_ANIMATION_TIMEOUT_BUFFER_MS } from "../../../../const/const.header.js";
import { HEADER_VAR_ICON_POP_MS } from "../../../../const/const.header.js";
import { HEADER_VAR_ICON_POP_STAGGER_MS } from "../../../../const/const.header.js";
import { HEADER_VAR_INTRO_FADE_MS } from "../../../../const/const.header.js";
import { HEADER_VAR_TITLE_TYPE_MS } from "../../../../const/const.header.js";
import { HEADER_VIEW_SELECTOR } from "../../../../const/const.header.js";

async function _headerAnimationStart() {
  const header = document.querySelector(HEADER_ROOT_SELECTOR);

  if (!header) {
    return;
  }

  if (!header.classList.contains(HEADER_ANIMATION_PENDING_CLASS)) {
    return;
  }

  try {
    const timeoutBufferMs = animCssMsGet(
      header,
      HEADER_VAR_ANIMATION_TIMEOUT_BUFFER_MS,
    );

    await animDelay(timeoutBufferMs);

    const fadeMs = animCssMsGet(header, HEADER_VAR_INTRO_FADE_MS);
    header.classList.add(HEADER_FADE_IN_CLASS);
    await animDelay(fadeMs + timeoutBufferMs);

    const title = document.querySelector(HEADER_TITLE_SELECTOR);
    const display = document.querySelector(HEADER_TITLE_DISPLAY_SELECTOR);

    if (title && display) {
      const fullText = title.dataset.fullTitle || HEADER_TITLE_TEXT;
      const typeMs = animCssMsGet(header, HEADER_VAR_TITLE_TYPE_MS);
      const charCount = fullText.length;
      const stepMs = charCount > 0 ? typeMs / charCount : typeMs;

      display.textContent = "";
      display.classList.add(HEADER_TITLE_TYPING_CLASS);

      for (let index = 0; index < charCount; index += 1) {
        display.textContent = fullText.slice(0, index + 1);
        await animDelay(stepMs);
      }

      display.classList.remove(HEADER_TITLE_TYPING_CLASS);
    }

    const popMs = animCssMsGet(header, HEADER_VAR_ICON_POP_MS);
    const staggerMs = animCssMsGet(header, HEADER_VAR_ICON_POP_STAGGER_MS);
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

    headerAnimationFinish();
  } catch {
    headerAnimationFinish();
  }
}

export { _headerAnimationStart as headerAnimationStart };
