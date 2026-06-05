import { dataStorageGetFinal } from "../../accounts/account-index.js";
import { dataSync } from "../../accounts/account-index.js";
import { cross } from "../section-cross.js";
import { authNumberGet } from "../../accounts/account-index.js";
import { setShouldPlayCodesIntro } from "./codes-state.js";
import { renderAccounts } from "./codes-cards.js";
import { revealCodesEmptyStatic } from "./codes-empty.js";
import { cancelPendingPostLoginReveal } from "./codes-reveal.js";
import { hasPendingPostLoginReveal } from "./codes-reveal.js";
import { initCodesSearch } from "./codes-search.js";
import { revealCodesSearchStatic } from "./codes-search.js";
import { resetCodesSearch } from "./codes-search.js";
import { initCodesListWheelSnap } from "./codes-scroll.js";
import { loadTimerInvertedPreference } from "./codes-timer.js";
import { stopTicker } from "./codes-timer.js";

export async function renderFromStorage() {
  const accounts = await dataStorageGetFinal();
  renderAccounts(accounts);
  return accounts;
}

export async function restore() {
  const accountNumber = await authNumberGet();

  if (!accountNumber) {
    renderAccounts([]);
    return [];
  }

  await loadTimerInvertedPreference();
  const accounts = await dataSync(accountNumber);
  renderAccounts(accounts);
  return accounts;
}

export function clear() {
  stopTicker();
  cancelPendingPostLoginReveal();
  resetCodesSearch();
  renderAccounts([]);
}

export function initCodes() {
  initCodesSearch();
  initCodesListWheelSnap();
}

export async function initOnLoad(skipIntroForQrResume = false) {
  setShouldPlayCodesIntro(false);

  const accountNumber = await authNumberGet();

  cross.codes.setSearchAuthVisible(Boolean(accountNumber));

  if (!accountNumber) {
    renderAccounts([]);
  } else if (hasPendingPostLoginReveal()) {
    // Post-login reveal runs when user menu closes.
  } else {
    await loadTimerInvertedPreference();
    const accounts = await dataSync(accountNumber);
    renderAccounts(accounts);
    revealCodesSearchStatic();
  }

  if (skipIntroForQrResume) {
    await cross.qrCodeSetup.processPendingScan({ instantOpen: true });
  } else if (!hasPendingPostLoginReveal()) {
    await cross.reviewPrompt.maybeShowOnInit();
  }
}
