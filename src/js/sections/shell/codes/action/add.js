import { bodySignedInAccountsApply } from "../../body/body-index.js";
import { codesAnimationAddInstant } from "../animation/add/instant.js";
import { codesAnimationAddSlide } from "../animation/add/slide.js";
import { codesAnimationAddStart } from "../animation/add/start.js";
import { codesCardCreate } from "../card/create.js";
import { codesStateStore } from "../state/store.js";
import { codesTickerCardPrime } from "../ticker/run.js";
import { codesTickerSecondRun } from "../ticker/run.js";
import { codesTickerStart } from "../ticker/run.js";
import { codesElementsGet } from "../util/elements.js";

import { CODES_HIDDEN_CLASS } from "../codes-const.js";

/** Inserts a newly added account card with intro animation. */
async function codesActionAdd(account) {
  const { list, template } = codesElementsGet();

  if (!list || !template || !account?.secret) {
    return;
  }

  const existingCards = [...list.querySelectorAll(".account-block")].filter(
    (card) => !card.classList.contains("account-block--manual-add-spacer"),
  );
  const alreadyVisible = existingCards.some(
    (card) => card.dataset.accountId === String(account.id),
  );

  if (alreadyVisible) {
    return;
  }

  bodySignedInAccountsApply(true);
  list.classList.remove(CODES_HIDDEN_CLASS);

  const card = codesCardCreate(template, account);

  if (!card) {
    return;
  }

  if (!codesStateStore.tickIntervalId) {
    codesTickerStart();
  }

  list.scrollTop = 0;

  if (existingCards.length) {
    const spacer = codesAnimationAddInstant();
    list.prepend(spacer);
    await codesAnimationAddStart(spacer);
    spacer.replaceWith(card);
    codesTickerCardPrime(card);

    if (codesStateStore.tickIntervalId) {
      codesTickerSecondRun();
    }

    await codesAnimationAddSlide(card);
    codesTickerCardPrime(card);
    return;
  }

  list.prepend(card);
  codesTickerCardPrime(card);
  await codesAnimationAddSlide(card);
  codesTickerCardPrime(card);
}

export { codesActionAdd };
