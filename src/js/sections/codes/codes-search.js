import { refreshCodesListScroll } from "./codes-scroll.js";
import { SELECTORS } from "./codes-state.js";

const FILTER_CARD_SELECTOR =
  ".account-block:not(.account-block--manual-add-spacer):not(.account-block--exit-spacer)";

export const CODES_SEARCH_SELECTOR = ".codes-search";
export const CODES_SEARCH_INPUT_SELECTOR = ".codes-search__input";

function getSearchSection() {
  return document.querySelector(CODES_SEARCH_SELECTOR);
}

function getSearchInput() {
  return document.querySelector(CODES_SEARCH_INPUT_SELECTOR);
}

export function getSearchQuery() {
  return getSearchInput()?.value ?? "";
}

function getAccountNameFromCard(card) {
  return card.querySelector(".account-name")?.textContent?.trim().toLowerCase() ?? "";
}

export function applyCodesSearchFilter(query = getSearchQuery()) {
  const list = document.querySelector(SELECTORS.list);

  if (!list || list.classList.contains("hidden")) {
    return;
  }

  const normalized = String(query).trim().toLowerCase();

  list.querySelectorAll(FILTER_CARD_SELECTOR).forEach((card) => {
    const matches =
      !normalized || getAccountNameFromCard(card).includes(normalized);

    card.classList.toggle("is-search-hidden", !matches);
  });

  refreshCodesListScroll(list);
}

export function resetCodesSearchFilter() {
  const list = document.querySelector(SELECTORS.list);

  list?.querySelectorAll(`${FILTER_CARD_SELECTOR}.is-search-hidden`).forEach((card) => {
    card.classList.remove("is-search-hidden");
  });

  refreshCodesListScroll(list);
}

export function resetCodesSearch() {
  const search = getSearchSection();
  const input = getSearchInput();

  if (input) {
    input.value = "";
  }

  search?.classList.remove("is-slot-open", "is-visible", "is-intro-pending");
  resetCodesSearchFilter();
}

export function setSearchAuthVisible(isVisible) {
  const search = getSearchSection();

  if (!search) {
    return;
  }

  search.classList.toggle("hidden", !isVisible);

  if (!isVisible) {
    resetCodesSearch();
    return;
  }

  revealCodesSearchStatic();
}

export function prepareCodesSearchIntro() {
  revealCodesSearchStatic();
}

export function revealCodesSearchStatic() {
  const search = getSearchSection();

  if (!search || search.classList.contains("hidden")) {
    return;
  }

  search.classList.remove("is-intro-pending");
  search.classList.add("is-slot-open", "is-visible");
}

export async function playCodesSearchIntro() {
  revealCodesSearchStatic();
}

export function initCodesSearch() {
  const input = getSearchInput();

  input?.addEventListener("input", () => {
    applyCodesSearchFilter();
  });
}
