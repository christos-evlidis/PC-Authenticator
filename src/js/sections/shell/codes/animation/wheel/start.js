import { animCssMsGet } from "../../../../../utils/utility-animation.js";
import { VAR_SLIDE_MS } from "../../../../../utils/utility-const.js";
import { CODES_LIST_SELECTOR, CODES_ROOT_SELECTOR } from "../../codes-const.js";

const CARD_SELECTOR =
  ".account-block:not(.account-block--manual-add-spacer):not(.account-block--exit-spacer):not(.is-filtered-out)";

/** Binds smooth one-card-per-tick wheel scrolling on the codes list. */
function codesAnimationWheelStart() {
  const root = document.querySelector(CODES_ROOT_SELECTOR);
  const list = document.querySelector(CODES_LIST_SELECTOR);

  if (!list || !root || list.dataset.wheelBound === "1") {
    return;
  }

  list.dataset.wheelBound = "1";

  let lastStepAt = 0;

  const getCards = () => [...list.querySelectorAll(CARD_SELECTOR)];
  const stepMs = () => animCssMsGet(list, VAR_SLIDE_MS) + 50;
  const maxScrollTop = () => Math.max(0, list.scrollHeight - list.clientHeight);

  const cardScrollTop = (card) =>
    card.getBoundingClientRect().top - list.getBoundingClientRect().top + list.scrollTop;

  const snapPositions = (cards) => {
    const maxTop = maxScrollTop();
    const seen = new Set();
    const positions = [];

    for (const card of cards) {
      const top = Math.min(cardScrollTop(card), maxTop);
      const key = Math.round(top);

      if (!seen.has(key)) {
        seen.add(key);
        positions.push(top);
      }
    }

    positions.sort((a, b) => a - b);
    return positions;
  };

  const indexAtPosition = (positions, top) => {
    let index = 0;

    for (let i = 0; i < positions.length; i += 1) {
      if (positions[i] <= top + 1) {
        index = i;
      }
    }

    return index;
  };

  root.addEventListener(
    "wheel",
    (event) => {
      if (list.classList.contains("is-hidden") || !list.contains(event.target)) {
        return;
      }

      const cards = getCards();

      if (cards.length < 2 || event.deltaY === 0) {
        return;
      }

      const now = Date.now();

      if (now - lastStepAt < stepMs()) {
        event.preventDefault();
        return;
      }

      const positions = snapPositions(cards);

      if (positions.length < 2) {
        return;
      }

      const currentTop = list.scrollTop;
      const direction = event.deltaY > 0 ? 1 : -1;
      const currentIndex = indexAtPosition(positions, currentTop);
      const nextIndex = currentIndex + direction;

      if (nextIndex < 0 || nextIndex >= positions.length) {
        return;
      }

      const target = positions[nextIndex];

      if (Math.abs(target - currentTop) < 1) {
        return;
      }

      event.preventDefault();
      lastStepAt = now;
      list.scrollTo({ top: target, behavior: "smooth" });
    },
    { passive: false, capture: true },
  );
}

export { codesAnimationWheelStart };
