import { bodyInit } from "../../body/body-index.js";
import { codesCardCreate } from "../card/create.js";
import { codesStateStore } from "../state/store.js";
import { codesTickerCardPrime } from "../ticker/run.js";
import { codesTickerSecondRun } from "../ticker/run.js";
import { codesTickerStart } from "../ticker/run.js";
import { codesElementsGet } from "../util/elements.js";

import { CODES_HIDDEN_CLASS } from "../../../../const/const.codes.js";

/** Inserts a newly added account card instantly. */
async function _codesActionAdd(account) {
  const { list, template } = codesElementsGet();
  if (!list || !template || !account?.secret) {
    return;
  }
  const existingCards = [...list.querySelectorAll(".account-block")];
  const alreadyVisible = existingCards.some(
    (card) => card.dataset.accountId === String(account.id),
  );
  if (alreadyVisible) {
    return;
  }
  bodyInit(true, { stateCodes: true });
  list.classList.remove(CODES_HIDDEN_CLASS);
  const card = codesCardCreate(template, account);
  if (!card) {
    return;
  }
  if (!codesStateStore.tickIntervalId) {
    codesTickerStart();
  }
  list.scrollTop = 0;
  
  list.prepend(card);
  codesTickerCardPrime(card);
  if (codesStateStore.tickIntervalId) {
    codesTickerSecondRun();
  }
}

export { _codesActionAdd as codesActionAdd };
