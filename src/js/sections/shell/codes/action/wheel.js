import { CODES_LIST_SELECTOR } from "../codes-const.js";

const CODES_WHEEL_CARD_SELECTOR =
  ".account-block:not(.account-block--manual-add-spacer):not(.account-block--exit-spacer)";

/** Snaps list scroll to one card per wheel tick. */
function codesActionWheel() {
  const list = document.querySelector(CODES_LIST_SELECTOR);

  if (!list || list.dataset.wheelSnapBound === "1") {
    return;
  }

  list.dataset.wheelSnapBound = "1";

  let snapLocked = false;

  const cards = () => list.querySelectorAll(CODES_WHEEL_CARD_SELECTOR);

  const cardScrollTop = (card) =>
    card.getBoundingClientRect().top - list.getBoundingClientRect().top + list.scrollTop;

  const cardIndex = () => {
    const items = cards();

    if (!items.length) {
      return 0;
    }

    const scrollTop = list.scrollTop;
    let index = 0;
    let bestDistance = Infinity;

    for (let i = 0; i < items.length; i += 1) {
      const distance = Math.abs(cardScrollTop(items[i]) - scrollTop);

      if (distance < bestDistance) {
        bestDistance = distance;
        index = i;
      }
    }

    return index;
  };

  const releaseSnapLock = () => {
    snapLocked = false;
  };

  const scrollToCard = (index) => {
    const items = cards();

    if (index < 0 || index >= items.length) {
      return;
    }

    list.scrollTo({
      top: cardScrollTop(items[index]),
      behavior: "smooth",
    });
  };

  list.addEventListener("scrollend", releaseSnapLock, { passive: true });

  list.addEventListener(
    "wheel",
    (event) => {
      const items = cards();

      if (items.length < 2 || event.deltaY === 0) {
        return;
      }

      if (snapLocked) {
        event.preventDefault();
        return;
      }

      const currentIndex = cardIndex();
      const nextIndex = currentIndex + (event.deltaY > 0 ? 1 : -1);

      if (nextIndex < 0 || nextIndex >= items.length) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      snapLocked = true;
      scrollToCard(nextIndex);
    },
    { passive: false },
  );
}

export { codesActionWheel };
