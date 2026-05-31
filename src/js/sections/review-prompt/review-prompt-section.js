import { UtilsAnimation } from "../../utils/utility-animation.js";
import { bumpSequenceGeneration } from "./review-prompt-sequence.js";
import { resetIntroSequence } from "./review-prompt-sequence.js";
import { runIntroSequence } from "./review-prompt-sequence.js";
import { SLIDE_MS } from "./review-prompt-sequence.js";
import { markDismissedAt } from "./review-prompt-storage.js";
import { markLastShownAt } from "./review-prompt-storage.js";
import { markOpenedAt } from "./review-prompt-storage.js";
import { recordFirstPopupOpen } from "./review-prompt-storage.js";
import { shouldShowReviewPrompt } from "./review-prompt-storage.js";
import { STORAGE_KEYS } from "./review-prompt-storage.js";
import { STORE_REVIEWS_URL } from "./review-prompt-storage.js";

let isOpen = false;
let closeTimerId = null;

function getSection() {
  return document.querySelector(".review-prompt");
}

function getIsOpen() {
  return isOpen;
}

async function openReviewPrompt() {
  const section = getSection();

  if (!section || isOpen) {
    return;
  }

  await markLastShownAt();

  isOpen = true;
  bumpSequenceGeneration();
  section.classList.remove("is-open", "is-close-visible");
  section.setAttribute("aria-hidden", "false");
  section.classList.add("is-active");
  resetIntroSequence(section);

  section.classList.add("is-open");

  void runIntroSequence(section, getIsOpen);
}

function closeReviewPrompt() {
  const section = getSection();

  if (!section || !isOpen) {
    return;
  }

  isOpen = false;
  bumpSequenceGeneration();
  section.classList.remove("is-open", "is-sequence-running");
  section.setAttribute("aria-hidden", "true");
  resetIntroSequence(section);

  if (closeTimerId != null) {
    window.clearTimeout(closeTimerId);
    closeTimerId = null;
  }

  section.classList.remove("is-active");
}

async function openStoreListing() {
  await markOpenedAt();
  window.open(STORE_REVIEWS_URL, "_blank", "noopener,noreferrer");
  closeReviewPrompt();
}

async function dismissReviewPrompt() {
  await markDismissedAt();
  closeReviewPrompt();
}

function bindReviewPrompt() {
  const section = getSection();

  if (!section) {
    return;
  }

  const rateBtn = section.querySelector(".review-prompt__rate");
  const dismissBtn = section.querySelector(".review-prompt__dismiss");

  dismissBtn?.addEventListener("click", () => {
    void dismissReviewPrompt();
  });
  rateBtn?.addEventListener("click", () => {
    void openStoreListing();
  });
}

async function maybeShowOnInit() {
  await recordFirstPopupOpen();

  if (!(await shouldShowReviewPrompt())) {
    return;
  }

  await UtilsAnimation.delay(80);
  await openReviewPrompt();
}

function initReviewPrompt() {
  bindReviewPrompt();
}

export const reviewPromptSection = {
  init: initReviewPrompt,
  open: openReviewPrompt,
  close: closeReviewPrompt,
  maybeShowOnInit,
  shouldShowReviewPrompt,
  getStoreUrl() {
    return STORE_REVIEWS_URL;
  },
  STORAGE_KEYS,
};

export { initReviewPrompt };
