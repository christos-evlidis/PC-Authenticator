import { CODES_CARD_TEMPLATE_SELECTOR } from "../codes-const.js";
import { CODES_LIST_SELECTOR } from "../codes-const.js";

/** Returns list and card template elements. */
function codesElementsGet() {
  return {
    list: document.querySelector(CODES_LIST_SELECTOR),
    template: document.querySelector(CODES_CARD_TEMPLATE_SELECTOR),
  };
}

export { codesElementsGet };
