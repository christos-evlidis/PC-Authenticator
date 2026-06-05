import { revealCodesEmptyStatic } from "./codes-empty.js";
import { setEmptyVisible } from "./codes-empty.js";
import { getScrollableCards } from "./codes-scroll.js";
import { refreshCodesListScroll } from "./codes-scroll.js";
import { SELECTORS } from "./codes-state.js";
import { getElements } from "./codes-state.js";
import { getTickIntervalId } from "./codes-state.js";
import { refreshCardRootsFromList } from "./codes-state.js";
import { createCardFromTemplate } from "./codes-card-template.js";
import { primeAccountCard } from "./codes-timer.js";
import { searchFilterApply } from "../search/index.js";
import { startTicker } from "./codes-timer.js";
import { stopTicker } from "./codes-timer.js";

export function slideInCodeCards(cards) {
  cards.forEach((card) => {
    card.classList.remove(
      "is-slide-pending",
      "is-slide-active",
      "is-slide-from-left",
      "is-slide-from-right",
      "is-manual-add-slide",
    );
  });

  return Promise.resolve();
}

export async function animateManualAccountAdd(account) {
  const { empty, list, template } = getElements();

  if (!list || !template || !account?.secret) {
    return;
  }

  const existingCards = getScrollableCards(list);
  const alreadyVisible = existingCards.some(
    (card) => card.dataset.accountId === String(account.id),
  );

  if (alreadyVisible) {
    return;
  }

  setEmptyVisible(empty, list, false);

  const card = createCardFromTemplate(template, account);

  if (!card) {
    return;
  }

  if (!getTickIntervalId()) {
    startTicker();
  }

  primeAccountCard(card);
  list.prepend(card);
  refreshCardRootsFromList(list);
  searchFilterApply();
  refreshCodesListScroll(list);
}

export function renderAccounts(accounts, options = {}) {
  const { empty, list, template } = getElements();

  stopTicker();

  if (!list || !template) {
    return [];
  }

  list.replaceChildren([]);

  const safeAccounts = Array.isArray(accounts) ? accounts : [];
  const renderableAccounts = safeAccounts.filter((account) => account?.secret);
  const isEmpty = renderableAccounts.length === 0;
  setEmptyVisible(empty, list, isEmpty);

  if (isEmpty) {
    revealCodesEmptyStatic();
    return [];
  }

  const cards = [];

  for (const account of renderableAccounts) {
    const card = createCardFromTemplate(template, account);

    if (card) {
      list.appendChild(card);
      cards.push(card);
    }
  }

  refreshCardRootsFromList(list);
  refreshCodesListScroll(list);
  searchFilterApply();
  startTicker();

  return cards;
}

export async function playCodesIntroIfNeeded(cards) {
  const { list } = getElements();
  await slideInCodeCards(cards);
  refreshCodesListScroll(list);
}
