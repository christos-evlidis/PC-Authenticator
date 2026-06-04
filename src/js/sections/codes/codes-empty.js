import { bodyContentAnimate } from "../body/body-animations/body-animate-content.js";
import { bodyContentStatic } from "../body/body-animations/body-animate-content.js";
import { BODY_CONTENT_SIGNED_IN_EMPTY_SELECTOR } from "../body/body-constants.js";
import { BODY_SIGNED_IN_EMPTY_MESSAGE_TEXT } from "../body/body-constants.js";
import { SELECTORS } from "./codes-state.js";

export function setEmptyVisible(empty, list, isEmpty) {
  const codesSection = document.querySelector(SELECTORS.section);

  empty?.classList.toggle("hidden", !isEmpty);
  codesSection?.classList.toggle("hidden", isEmpty);
  list?.classList.toggle("hidden", isEmpty);
}

export function prepareCodesEmptyIntro() {
  revealCodesEmptyStatic();
}

export function revealCodesEmptyStatic() {
  const content = document.querySelector(BODY_CONTENT_SIGNED_IN_EMPTY_SELECTOR);

  bodyContentStatic(content, BODY_SIGNED_IN_EMPTY_MESSAGE_TEXT, {
    boldPlus: true,
  });
}

export async function playCodesEmptyIntro() {
  const content = document.querySelector(BODY_CONTENT_SIGNED_IN_EMPTY_SELECTOR);

  await bodyContentAnimate(content, BODY_SIGNED_IN_EMPTY_MESSAGE_TEXT, {
    boldPlus: true,
  });
}
