import { bodySignedInAccountsApply } from "../../body/body-index.js";
import { codesAnimationIntroReset } from "../animation/intro/reset.js";
import { codesCardCreate } from "../card/create.js";
import { codesTickerStart } from "../ticker/run.js";
import { codesTickerStop } from "../ticker/run.js";
import { codesElementsGet } from "../util/elements.js";

import { CODES_HIDDEN_CLASS } from "../codes-const.js";

/** Rebuilds account cards from data and starts the ticker. */
function codesCardRender(accounts, options = {}) {
  const { list, template } = codesElementsGet();
  const playIntro = Boolean(options.playIntro);

  codesTickerStop();

  if (!list || !template) {
    return [];
  }

  list.replaceChildren([]);

  const safeAccounts = Array.isArray(accounts) ? accounts : [];
  const renderableAccounts = safeAccounts.filter((account) => account?.secret);
  const isEmpty = renderableAccounts.length === 0;

  bodySignedInAccountsApply(!isEmpty);
  list.classList.toggle(CODES_HIDDEN_CLASS, isEmpty);

  if (isEmpty) {
    return [];
  }

  const cards = [];

  for (const account of renderableAccounts) {
    const card = codesCardCreate(template, account);

    if (card) {
      if (playIntro) {
        codesAnimationIntroReset(card);
      }

      list.append(card);
      cards.push(card);
    }
  }

  codesTickerStart();

  return cards;
}

export { codesCardRender };
