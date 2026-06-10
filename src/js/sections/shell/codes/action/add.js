import { codesAnimationAddInstant } from "../animation/add/instant.js";
import { codesAnimationAddReset } from "../animation/add/reset.js";
import { codesAnimationAddStart } from "../animation/add/start.js";
import { codesAnimationIntroInstant } from "../animation/intro/instant.js";
import { codesAnimationIntroReset } from "../animation/intro/reset.js";
import { codesCardCreate } from "../card/create.js";
import { codesStateStore } from "../state/store.js";
import { codesTickerCardPrime } from "../ticker/run.js";
import { codesTickerStart } from "../ticker/run.js";
import { codesElementsGet } from "../util/elements.js";

/** Inserts a newly added account card with intro animation. */
async function codesActionAdd(account) {
  const { empty, list, template } = codesElementsGet();

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

  codesAnimationAddReset(empty, list, false);

  const card = codesCardCreate(template, account);

  if (!card) {
    return;
  }

  if (!codesStateStore.tickIntervalId) {
    codesTickerStart();
  }

  codesTickerCardPrime(card);
  card.classList.add("is-manual-add-slide");
  codesAnimationIntroReset(card);

  if (existingCards.length) {
    const spacer = codesAnimationAddInstant();
    list.prepend(spacer);
    await codesAnimationAddStart(spacer);
    spacer.replaceWith(card);
    await codesAnimationIntroInstant(card);
    return;
  }

  list.prepend(card);
  codesTickerCardPrime(card);
  await codesAnimationIntroInstant(card);
}

export { codesActionAdd };
