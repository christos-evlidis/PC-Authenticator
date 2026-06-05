import { refreshCodesListScroll } from "../../codes/codes-scroll.js";
import { SELECTORS } from "../../codes/codes-state.js";
import { SEARCH_FILTER_CARD_SELECTOR } from "../constants.js";
import { SEARCH_INPUT_SELECTOR } from "../constants.js";

/** Applies the current query to hide or show account cards in the list. */
export function searchFilterApply() {
  const list = document.querySelector(SELECTORS.list);

  if (!list || list.classList.contains("hidden")) {
    return;
  }

  const normalized =
    document.querySelector(SEARCH_INPUT_SELECTOR)?.value?.trim().toLowerCase() ?? "";

  list.querySelectorAll(SEARCH_FILTER_CARD_SELECTOR).forEach((card) => {
    const accountName =
      card.querySelector(".account-name")?.textContent?.trim().toLowerCase() ?? "";
    const matches = !normalized || accountName.includes(normalized);

    card.classList.toggle("is-search-hidden", !matches);
  });

  refreshCodesListScroll(list);
}

/** Clears search filter classes from all cards. */
export function searchFilterReset() {
  const list = document.querySelector(SELECTORS.list);

  list?.querySelectorAll(`${SEARCH_FILTER_CARD_SELECTOR}.is-search-hidden`).forEach((card) => {
    card.classList.remove("is-search-hidden");
  });

  refreshCodesListScroll(list);
}
