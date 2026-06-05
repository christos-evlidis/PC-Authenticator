import { dataStorageGetFinal } from "../../accounts/accounts-index.js";
import { dataSync } from "../../accounts/accounts-index.js";
import { cross } from "../section-cross.js";
import { authNumberGet } from "../../accounts/accounts-index.js";
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

/** Renders the active account list already stored locally. */
export async function renderFromStorage() {
  const accounts = await dataStorageGetFinal();
  renderAccounts(accounts);
  return accounts;
}

/** Pulls cloud backup and re-renders the codes list. */
export async function restore() {
  const authNumber = await authNumberGet();

  if (!authNumber) {
    renderAccounts([]);
    return [];
  }

  await loadTimerInvertedPreference();
  const accounts = await dataSync(authNumber);
  renderAccounts(accounts);
  return accounts;
}

/** Stops timers and clears rendered codes. */
export function clear() {
  stopTicker();
  cancelPendingPostLoginReveal();
  resetCodesSearch();
  renderAccounts([]);
}

/** Wires codes search and list scroll behavior. */
export function initCodes() {
  initCodesSearch();
  initCodesListWheelSnap();
}

/** Loads codes on section init; syncs from cloud when signed in. */
export async function initOnLoad(skipIntroForQrResume = false) {
  setShouldPlayCodesIntro(false);

  const authNumber = await authNumberGet();

  cross.codes.setSearchAuthVisible(Boolean(authNumber));

  if (!authNumber) {
    renderAccounts([]);
  } else if (hasPendingPostLoginReveal()) {
    // Post-login reveal runs when user menu closes.
  } else {
    await loadTimerInvertedPreference();
    const accounts = await dataSync(authNumber);
    renderAccounts(accounts);
    revealCodesSearchStatic();
  }

  if (skipIntroForQrResume) {
    await cross.qrCodeSetup.processPendingScan({ instantOpen: true });
  } else if (!hasPendingPostLoginReveal()) {
    await cross.reviewPrompt.maybeShowOnInit();
  }
}
