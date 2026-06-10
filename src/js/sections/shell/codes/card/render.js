import { codesAnimationIntroReset } from "../animation/intro/reset.js";
import { codesStateStore } from "../state/store.js";
import { codesTickerStart } from "../ticker/run.js";
import { codesTickerStop } from "../ticker/run.js";
import { codesElementsGet } from "../util/elements.js";
import { codesCardCreate } from "./create.js";

import { CODES_HIDDEN_CLASS } from "../codes-const.js";

/** Shows or hides the account list; empty state is handled by body. */
function codesCardRenderEmpty(empty, list, isEmpty) {
  empty?.classList.add(CODES_HIDDEN_CLASS);
  list?.classList.toggle(CODES_HIDDEN_CLASS, isEmpty);
}

/** Rebuilds account cards from data and starts the ticker. */
function codesCardRender(accounts, options = {}) {
  const { empty, list, template } = codesElementsGet();
  const playIntro = Boolean(options.playIntro);

  codesTickerStop();

  if (!list || !template) {
    return [];
  }

  list.replaceChildren([]);

  const safeAccounts = Array.isArray(accounts) ? accounts : [];
  const renderableAccounts = safeAccounts.filter((account) => account?.secret);
  const isEmpty = renderableAccounts.length === 0;
  codesCardRenderEmpty(empty, list, isEmpty);

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
