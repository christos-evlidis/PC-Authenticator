import { authStorageGet } from "../../../services/auth/auth-index.js";
import { dataHandleSync } from "../../../services/data/data-index.js";

import { bodyInit } from "../body/body-index.js";
import { codesActionWheel } from "./action/wheel.js";
import { codesCardCreate } from "./card/create.js";
import { codesStateStore } from "./state/store.js";
import { codesTickerStart } from "./ticker/run.js";
import { codesTickerStop } from "./ticker/run.js";
import { codesElementsGet } from "./util/elements.js";
import { codesUtilTimerPreferenceLoad } from "./util/timer-preference.js";

import { CODES_HIDDEN_CLASS } from "../../../const/const.codes.js";
import { CODES_ROOT_SELECTOR } from "../../../const/const.codes.js";

let _codesInitListenersRegistered = false;

/** Rebuilds account cards from data and starts the ticker. */
function _codesCardRender(accounts, options = {}) {
  const { list, template } = codesElementsGet();
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
      list.append(card);
      cards.push(card);
    }
  }
  codesTickerStart();
  return cards;
}

/** Stops the ticker and clears rendered account cards. */
function _codesLoadClear() {
  codesTickerStop();
  _codesCardRender([]);
}

/** Syncs accounts from storage and renders the codes list. */
async function _codesLoadRestore() {
  const authNumber = await authStorageGet();

  if (!authNumber) {
    _codesCardRender([]);
    return [];
  }

  await codesUtilTimerPreferenceLoad();
  const accounts = await dataHandleSync(authNumber);
  _codesCardRender(accounts);
  return accounts;
}

/**
 * Registers codes listeners and optionally loads accounts.
 * Call with no arguments during module init; pass accounts to render the list.
 */
async function _codesInit(accounts, options) {
  if (!_codesInitListenersRegistered) {
    codesActionWheel();
    _codesInitListenersRegistered = true;
  }

  if (accounts === undefined) {
    void codesUtilTimerPreferenceLoad();
    return;
  }

  try {
    await codesUtilTimerPreferenceLoad();

    const safeAccounts = Array.isArray(accounts) ? accounts : [];
    _codesCardRender(safeAccounts);
  } finally {
    codesStateStore.shouldPlayIntro = false;
  }
}

/** Shows or hides the codes section on sign-out and clears cards. */
function _codesApply(isSignedIn) {
  if (!isSignedIn) {
    document.querySelector(CODES_ROOT_SELECTOR)?.classList.add(CODES_HIDDEN_CLASS);
    _codesLoadClear();
  }
}

export {
  _codesApply as codesApply,
  _codesInit as codesInit,
  _codesLoadRestore as codesLoadRestore,
};
