import {
  animAnimationEndWait,
  animCssMsGet,
  animDelay,
} from "../../../../../utils/utility-animation.js";
import {
  VAR_BUFFER_MS,
  VAR_FADE_MS,
  VAR_FILL_CONTRACT_MS,
  VAR_FILL_EXPAND_MS,
  VAR_RESULT_COPY_DRAW_MS,
} from "../../../../../utils/motion-const.js";
import { codesAnimationCopyFinish } from "./finish.js";
import { codesAnimationCopyReset } from "./reset.js";

const COPY_FILL_COVERAGE_RATIO = 0.75;

/** Plays the copy fill and checkmark feedback on a card. */
async function codesAnimationCopyStart(card, options = {}) {
  if (card.dataset.copyFeedbackActive === "1") {
    return;
  }

  const { onCheckmarkStart } = options;
  const fill = card.querySelector(".account-block__copy-fill");
  const check = card.querySelector(".account-block__copy-check");
  const circle = check?.querySelector(".copy-check__circle");
  const mark = check?.querySelector(".copy-check__mark");

  if (!fill || !check) {
    return;
  }

  const fillExpandMs = animCssMsGet(card, VAR_FILL_EXPAND_MS);
  const fillContractMs = animCssMsGet(card, VAR_FILL_CONTRACT_MS);
  const checkDrawMs = animCssMsGet(card, VAR_RESULT_COPY_DRAW_MS);
  const fadeMs = animCssMsGet(card, VAR_FADE_MS);
  const timeoutBufferMs = animCssMsGet(card, VAR_BUFFER_MS);
  const fillCoverageMs = Math.round(fillExpandMs * COPY_FILL_COVERAGE_RATIO);

  card.dataset.copyFeedbackActive = "1";
  card.classList.add("is-copy-feedback-active");
  codesAnimationCopyReset(fill, check);

  fill.classList.add("is-expanding");

  await Promise.race([
    animAnimationEndWait(fill, "copy-fill-expand", fillExpandMs + timeoutBufferMs),
    animDelay(fillCoverageMs),
  ]);

  fill.getAnimations?.().forEach((animation) => animation.cancel());
  fill.classList.remove("is-expanding");
  fill.style.clipPath = "circle(150% at 50% 50%)";
  check.classList.add("is-visible", "is-animating");
  onCheckmarkStart?.();

  const markDrawMs = checkDrawMs + Math.round(checkDrawMs * 0.2);

  await Promise.all([
    animAnimationEndWait(circle, "copy-check-circle-draw", checkDrawMs + timeoutBufferMs),
    animAnimationEndWait(mark, "copy-check-mark-draw", markDrawMs + timeoutBufferMs),
  ]);

  check.classList.remove("is-animating");
  check.classList.add("is-drawn", "is-hiding");
  fill.style.removeProperty("clip-path");
  fill.classList.remove("is-expanding");
  fill.classList.add("is-contracting");

  await Promise.all([
    animAnimationEndWait(fill, "copy-fill-contract", fillContractMs + timeoutBufferMs),
    animAnimationEndWait(check, "copy-check-fade", fadeMs + timeoutBufferMs),
  ]);

  codesAnimationCopyFinish(card, fill, check);
}

export { codesAnimationCopyStart };
