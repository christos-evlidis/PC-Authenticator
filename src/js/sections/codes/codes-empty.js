import { bodyRevealMessage } from "../body/index.js";
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
  bodyRevealMessage({ signedIn: true });
}
