import { bodyAnimateForSignedInContent } from "../body/body-animations/body-animate-for-signed-in-content.js";
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
  void bodyAnimateForSignedInContent({ static: true });
}

export async function playCodesEmptyIntro() {
  await bodyAnimateForSignedInContent();
}
