import { codesAnimationCopyFinish } from "./finish.js";
import { codesAnimationCopyReset } from "./reset.js";

const COPY_FILL_EXPAND_MS = 1000;
const COPY_FILL_CONTRACT_MS = 480;
const COPY_CHECK_DRAW_MS = 280;
const COPY_CHECK_LEAD_MS = 320;
const COPY_CHECK_HOLD_MS = 180;
const COPY_FADE_MS = 250;

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

  const delay = (ms) =>
    new Promise((resolve) => {
      window.setTimeout(resolve, ms);
    });

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
  const expandDone = wait(fill, "copy-fill-expand", COPY_FILL_EXPAND_MS + 40);

  await delay(Math.max(0, COPY_FILL_EXPAND_MS - COPY_CHECK_LEAD_MS));
  check.classList.add("is-visible", "is-animating");
  onCheckmarkStart?.();

  await Promise.all([
    expandDone,
    wait(check.querySelector(".copy-check__mark"), "copy-check-mark-draw", COPY_CHECK_DRAW_MS + 60),
  ]);

  check.classList.remove("is-animating");
  check.classList.add("is-drawn");
  await delay(COPY_CHECK_HOLD_MS);

  check.classList.add("is-hiding");
  fill.classList.remove("is-expanding");
  fill.classList.add("is-contracting");

  await Promise.all([
    wait(fill, "copy-fill-contract", COPY_FILL_CONTRACT_MS + 40),
    wait(check, "copy-check-fade", COPY_FADE_MS + 40),
  ]);

  codesAnimationCopyFinish(card, fill, check);
}

export { codesAnimationCopyStart };
