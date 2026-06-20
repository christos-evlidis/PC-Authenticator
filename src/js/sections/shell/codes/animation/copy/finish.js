import { codesAnimationCopyReset } from "./reset.js";

/** Tears down copy feedback state after the animation sequence. */
function _codesAnimationCopyFinish(card, fill, check) {
  codesAnimationCopyReset(fill, check);
  card.classList.remove("is-copy-feedback-active");
  delete card.dataset.copyFeedbackActive;
}

export { _codesAnimationCopyFinish as codesAnimationCopyFinish };
