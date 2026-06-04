export const SLIDE_MS = 320;
export const STAR_POP_MS = 220;
export const TYPE_TITLE_MS = 700;
export const TYPE_MESSAGE_MS = 2400;
export const MARKER_DRAW_MS = 520;
export const RATE_POP_MS = 200;
export const DISMISS_DELAY_MS = 5000;

let sequenceGeneration = 0;
let dismissTimerId = null;

export function bumpSequenceGeneration() {
  sequenceGeneration += 1;
  return sequenceGeneration;
}

export function getSequenceGeneration() {
  return sequenceGeneration;
}

function getFullText(element) {
  return element?.dataset?.fullText ?? element?.textContent ?? "";
}

function revealElement(element) {
  if (!element) {
    return;
  }

  element.classList.remove("is-seq-hidden");
  element.classList.add("is-seq-visible");
}

function revealMessagePart(part) {
  if (!part) {
    return;
  }

  part.textContent = getFullText(part);
  part.classList.remove("is-intro-typing");
}

export function resetIntroSequence(section) {
  if (dismissTimerId != null) {
    window.clearTimeout(dismissTimerId);
    dismissTimerId = null;
  }

  section.classList.remove("is-sequence-running");

  const stars = section.querySelectorAll(".review-prompt__star");
  const titleLive = section.querySelector(".review-prompt__title-live");
  const messageLive = section.querySelector(".review-prompt__message-live");
  const parts = section.querySelectorAll(".review-prompt__message-part");
  const mark = section.querySelector(".review-prompt__mark");
  const markText = section.querySelector(".review-prompt__mark-text");
  const rate = section.querySelector(".review-prompt__rate");
  const dismiss = section.querySelector(".review-prompt__dismiss");

  stars.forEach((star) => {
    star.classList.add("is-seq-hidden");
    star.classList.remove("is-seq-visible", "is-pop-pending", "is-pop-active");
  });

  [titleLive, messageLive, rate, dismiss].forEach((node) => {
    if (!node) {
      return;
    }

    node.classList.add("is-seq-hidden");
    node.classList.remove(
      "is-seq-visible",
      "is-pop-pending",
      "is-pop-active",
      "is-intro-typing",
      "is-fade-in",
    );
  });

  parts.forEach((part) => {
    part.classList.remove("is-intro-typing");
    part.textContent = "";
  });

  if (titleLive) {
    titleLive.classList.remove("is-intro-typing");
    titleLive.textContent = "";
  }

  if (mark) {
    mark.classList.remove("is-marker-drawing", "is-marker-drawn");
  }

  if (markText) {
    markText.textContent = "";
  }

  if (rate) {
    rate.classList.remove("is-pop-pending", "is-pop-active");
  }
}

function revealIntroSequenceStatic(section) {
  const stars = section.querySelectorAll(".review-prompt__star");
  const titleLive = section.querySelector(".review-prompt__title-live");
  const messageLive = section.querySelector(".review-prompt__message-live");
  const messageParts =
    messageLive?.querySelectorAll(".review-prompt__message-part") ?? [];
  const mark = section.querySelector(".review-prompt__mark");
  const markText = section.querySelector(".review-prompt__mark-text");
  const rate = section.querySelector(".review-prompt__rate");

  stars.forEach((star) => revealElement(star));

  if (titleLive) {
    titleLive.textContent = getFullText(titleLive);
    revealElement(titleLive);
  }

  if (messageLive) {
    revealElement(messageLive);
    messageParts.forEach(revealMessagePart);
  }

  if (markText) {
    markText.textContent = getFullText(markText);
  }

  if (mark) {
    mark.classList.add("is-marker-drawn");
  }

  if (rate) {
    revealElement(rate);
  }
}

export async function runIntroSequence(section, isOpen) {
  const generation = bumpSequenceGeneration();
  const isCurrent = () => generation === getSequenceGeneration() && isOpen();

  section.classList.add("is-sequence-running");
  resetIntroSequence(section);
  revealIntroSequenceStatic(section);

  dismissTimerId = window.setTimeout(() => {
    dismissTimerId = null;

    if (!isCurrent()) {
      return;
    }

    const dismiss = section.querySelector(".review-prompt__dismiss");

    if (!dismiss) {
      return;
    }

    dismiss.classList.remove("is-seq-hidden");
    dismiss.classList.add("is-seq-visible", "is-fade-in");
  }, DISMISS_DELAY_MS);
}
