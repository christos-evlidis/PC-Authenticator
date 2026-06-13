import { authStorageGet } from "../../../services/auth/auth-index.js";
import { dataHandleSync } from "../../../services/data/data-index.js";

import { bodyInit } from "../body/body-index.js";
import { codesActionWheel } from "./action/wheel.js";
import { codesAnimationIntroFinish } from "./animation/intro/finish.js";
import { codesAnimationIntroReset } from "./animation/intro/reset.js";
import { codesAnimationIntroStart } from "./animation/intro/start.js";
import { codesCardCreate } from "./card/create.js";
import { codesStateStore } from "./state/store.js";
import { codesTickerStart } from "./ticker/run.js";
import { codesTickerStop } from "./ticker/run.js";
import { codesElementsGet } from "./util/elements.js";
import { codesUtilTimerPreferenceLoad } from "./util/timer-preference.js";

import { CODES_HIDDEN_CLASS } from "../../../const/const.codes.js";
import { CODES_ROOT_SELECTOR } from "../../../const/const.codes.js";

let codesInitListenersRegistered = false;

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
  bodyInit(true, { stateCodes: !isEmpty });
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

/** Stops the ticker and clears rendered account cards. */
function codesLoadClear() {
  codesTickerStop();
  codesCardRender([]);
}

/** Syncs accounts from storage and renders the codes list. */
async function codesLoadRestore() {
  const authNumber = await authStorageGet();

  if (!authNumber) {
    codesCardRender([]);
    return [];
  }

  await codesUtilTimerPreferenceLoad();
  const accounts = await dataHandleSync(authNumber);
  codesCardRender(accounts);
  return accounts;
}

/**
 * Registers codes listeners and optionally loads accounts with intro animation.
 * Call with no arguments during module init; pass accounts to render the list.
 */
async function codesInit(accounts, options) {
  if (!codesInitListenersRegistered) {
    codesActionWheel();
    codesInitListenersRegistered = true;
  }

  if (accounts === undefined) {
    void codesUtilTimerPreferenceLoad();
    return;
  }

  const { playIntro = false } = options ?? {};

  try {
    await codesUtilTimerPreferenceLoad();

    const safeAccounts = Array.isArray(accounts) ? accounts : [];
    const cards = codesCardRender(safeAccounts, { playIntro });

    if (playIntro && cards.length) {
      await codesAnimationIntroStart(cards);
    }
  } finally {
    codesAnimationIntroFinish();
    codesStateStore.shouldPlayIntro = false;
  }
}

/** Shows or hides the codes section on sign-out and clears cards. */
function codesApply(isSignedIn) {
  if (!isSignedIn) {
    document.querySelector(CODES_ROOT_SELECTOR)?.classList.add(CODES_HIDDEN_CLASS);
    codesLoadClear();
  }
}

export { codesApply };
export { codesInit };
export { codesLoadRestore };
