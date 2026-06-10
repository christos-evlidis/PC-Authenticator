import { animCssMsGet } from "../../../../../utils/utility-animation.js";
import {
  VAR_FADE_MS,
  VAR_FILL_CONTRACT_MS,
  VAR_FILL_EXPAND_MS,
  VAR_RESULT_COPY_DRAW_MS,
} from "../../../../../utils/motion-const.js";
import { codesAnimationCopyFinish } from "./finish.js";
import { codesAnimationCopyReset } from "./reset.js";

/** Plays the copy fill and checkmark feedback on a card. */
async function codesAnimationCopyStart(card, options = {}) {
  if (card.dataset.copyFeedbackActive === "1") {
    return;
  }

  const { onCheckmarkStart } = options;
  const fill = card.querySelector(".account-block__copy-fill");
  const check = card.querySelector(".account-block__copy-check");

  if (!fill || !check) {
    return;
  }

  const fillExpandMs = animCssMsGet(card, VAR_FILL_EXPAND_MS);
  const fillContractMs = animCssMsGet(card, VAR_FILL_CONTRACT_MS);
  const checkDrawMs = animCssMsGet(card, VAR_RESULT_COPY_DRAW_MS);
  const fadeMs = animCssMsGet(card, VAR_FADE_MS);

  const wait = (element, animationName, timeoutMs) =>
    new Promise((resolve) => {
      if (!element) {
        resolve();
        return;
      }

      const timer = window.setTimeout(resolve, timeoutMs);
      const onEnd = (event) => {
        if (event.target !== element || event.animationName !== animationName) {
          return;
        }

        window.clearTimeout(timer);
        element.removeEventListener("animationend", onEnd);
        resolve();
      };

      element.addEventListener("animationend", onEnd);
    });

  card.dataset.copyFeedbackActive = "1";
  card.classList.add("is-copy-feedback-active");
  codesAnimationCopyReset(fill, check);

  fill.classList.add("is-expanding");
  await wait(fill, "copy-fill-expand", fillExpandMs + 40);

  check.classList.add("is-visible", "is-animating");
  onCheckmarkStart?.();

  await Promise.all([
    wait(check.querySelector(".copy-check__circle"), "copy-check-circle-draw", checkDrawMs + 60),
    wait(check.querySelector(".copy-check__mark"), "copy-check-mark-draw", checkDrawMs + 60),
  ]);

  check.classList.remove("is-animating");
  check.classList.add("is-drawn", "is-hiding");
  fill.classList.remove("is-expanding");
  fill.classList.add("is-contracting");

  await Promise.all([
    wait(fill, "copy-fill-contract", fillContractMs + 40),
    wait(check, "copy-check-fade", fadeMs + 40),
  ]);

  codesAnimationCopyFinish(card, fill, check);
}

export { codesAnimationCopyStart };
