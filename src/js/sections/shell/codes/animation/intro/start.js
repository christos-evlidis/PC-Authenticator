import { codesAnimationIntroInstant } from "./instant.js";

import { CODES_CARD_INTRO_PENDING_CLASS } from "../../codes-const.js";
import { CODES_INTRO_STAGGER_MS } from "../../codes-const.js";
import { CODES_ROOT_SELECTOR } from "../../codes-const.js";

/** Plays staggered intro for all cards and sets pending class. */
async function codesAnimationIntroStart(cards) {
  if (!cards.length) {
    return;
  }

  document.querySelector(CODES_ROOT_SELECTOR)?.classList.add(CODES_CARD_INTRO_PENDING_CLASS);

  await new Promise((resolve) => {
    if (!cards.length) {
      resolve();
      return;
    }

    let completed = 0;
    const total = cards.length;

    const onCardFinished = () => {
      completed += 1;

      if (completed >= total) {
        resolve();
      }
    };

    cards.forEach((card, index) => {
      window.setTimeout(() => {
        codesAnimationIntroInstant(card).then(onCardFinished);
      }, index * CODES_INTRO_STAGGER_MS);
    });
  });
}

export { codesAnimationIntroStart };
