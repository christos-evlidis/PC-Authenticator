import { LIST_WHEEL_COOLDOWN_MS } from "./codes-state.js";
import { SELECTORS } from "./codes-state.js";

export const CARD_SELECTOR =
  ".account-block:not(.account-block--manual-add-spacer):not(.account-block--exit-spacer):not(.is-search-hidden)";

/**
 * @param {Element | null | undefined} list
 * @returns {HTMLElement[]}
 */
export function getScrollableCards(list) {
  if (!list) {
    return [];
  }

  return [...list.querySelectorAll(CARD_SELECTOR)];
}

/**
 * @param {Element | null | undefined} list
 * @returns {boolean}
 */
export function listNeedsNativeScroll(list) {
  if (!list) {
    return false;
  }

  return list.scrollHeight > list.clientHeight + 2;
}

/**
 * Clears transient scroll overrides (manual-add only uses class toggles elsewhere).
 *
 * @param {Element | null | undefined} list
 */
export function updateListScrollMode(list) {
  if (!list) {
    return;
  }

  list.classList.remove("is-scroll-free");
}

/**
 * @param {Element | null | undefined} list
 * @returns {object}
 */
export function getListScrollDiagnostics(list) {
  if (!list) {
    return {
      cardCount: 0,
      scrollHeight: 0,
      clientHeight: 0,
      scrollTop: 0,
      needsNativeScroll: false,
    };
  }

  return {
    cardCount: getScrollableCards(list).length,
    scrollHeight: list.scrollHeight,
    clientHeight: list.clientHeight,
    scrollTop: list.scrollTop,
    needsNativeScroll: listNeedsNativeScroll(list),
  };
}

/**
 * @param {Element} list
 * @returns {number}
 */
export function getCardScrollIndex(list) {
  const cards = getScrollableCards(list);

  if (!cards.length) {
    return 0;
  }

  const scrollTop = list.scrollTop;
  let index = 0;
  let bestDistance = Infinity;

  cards.forEach((card, cardIndex) => {
    const distance = Math.abs(card.offsetTop - scrollTop);

    if (distance < bestDistance) {
      bestDistance = distance;
      index = cardIndex;
    }
  });

  return index;
}

/**
 * @param {Element} list
 * @param {number} index
 */
export function scrollListToCardIndex(list, index) {
  const cards = getScrollableCards(list);

  if (index < 0 || index >= cards.length) {
    return;
  }

  list.scrollTo({
    top: cards[index].offsetTop,
    behavior: "smooth",
  });
}

/**
 * @param {Element} list
 * @param {HTMLElement} card
 */
export function scrollListToCard(list, card) {
  list.scrollTo({
    top: card.offsetTop,
    behavior: "smooth",
  });
}

/**
 * @param {Element} list
 * @param {{ behavior?: ScrollBehavior }} [options]
 */
export function scrollListToTop(list, options = {}) {
  const { behavior = "auto" } = options;

  list.scrollTo({
    top: 0,
    behavior,
  });
}

/**
 * Pins scroll position synchronously (avoids snap fighting scrollTo).
 *
 * @param {Element} list
 * @param {number} [top]
 */
export function lockListScrollTop(list, top = 0) {
  list.scrollTop = top;
}

/**
 * Waits for layout/paint after DOM changes.
 *
 * @returns {Promise<void>}
 */
export function settleListLayout() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    });
  });
}

/** @type {Element | null} */
let manualAddScrollGuardList = null;

function onManualAddScrollGuard() {
  if (manualAddScrollGuardList) {
    manualAddScrollGuardList.scrollTop = 0;
  }
}

/**
 * Disables snap/wheel snap while a manual-add spacer animation runs.
 *
 * @param {Element} list
 */
export function beginManualAddScrollSession(list) {
  endManualAddScrollSession(list);

  list.classList.add("is-manual-add-active");
  lockListScrollTop(list, 0);

  manualAddScrollGuardList = list;
  list.addEventListener("scroll", onManualAddScrollGuard, { passive: true });
}

/**
 * Re-enables snap mode based on current list overflow.
 *
 * @param {Element} list
 */
export function endManualAddScrollSession(list) {
  list.removeEventListener("scroll", onManualAddScrollGuard);
  manualAddScrollGuardList = null;

  list.classList.remove("is-manual-add-active");
  refreshCodesListScroll(list);
}

/**
 * @param {Element | null | undefined} list
 */
export function refreshCodesListScroll(list) {
  const target = list ?? document.querySelector(SELECTORS.list);

  if (!target) {
    return;
  }

  updateListScrollMode(target);
}

export function initCodesListWheelSnap() {
  const list = document.querySelector(SELECTORS.list);

  if (!list || list.dataset.wheelSnapBound === "1") {
    refreshCodesListScroll(list);
    return;
  }

  list.dataset.wheelSnapBound = "1";

  let snapLocked = false;

  const releaseSnapLock = () => {
    snapLocked = false;
  };

  list.addEventListener("scrollend", releaseSnapLock, { passive: true });

  list.addEventListener(
    "wheel",
    (event) => {
      if (list.classList.contains("is-manual-add-active")) {
        return;
      }

      const cards = getScrollableCards(list);

      if (cards.length < 2 || event.deltaY === 0) {
        return;
      }

      if (snapLocked) {
        event.preventDefault();
        return;
      }

      const currentIndex = getCardScrollIndex(list);
      const nextIndex = currentIndex + (event.deltaY > 0 ? 1 : -1);

      if (nextIndex < 0 || nextIndex >= cards.length) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      snapLocked = true;
      scrollListToCardIndex(list, nextIndex);
      window.setTimeout(releaseSnapLock, LIST_WHEEL_COOLDOWN_MS);
    },
    { passive: false },
  );

  refreshCodesListScroll(list);
}
