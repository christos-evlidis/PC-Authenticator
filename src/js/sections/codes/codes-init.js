import { dataStorageGetFinal } from "../../accounts/accounts-index.js";
import { dataSync } from "../../accounts/accounts-index.js";
import { cross } from "../section-cross.js";
import { authNumberGet } from "../../accounts/accounts-index.js";
import { getPopupResumePending } from "../../popup-resume/popup-resume.js";
import { initPopupResume } from "../../popup-resume/popup-resume.js";
import { setShouldPlayCodesIntro } from "./codes-state.js";
import { renderAccounts } from "./codes-cards.js";
import { cancelPendingPostLoginReveal } from "./codes-reveal.js";
import { hasPendingPostLoginReveal } from "./codes-reveal.js";
import { initCodesListWheelSnap } from "./codes-scroll.js";
import { loadTimerInvertedPreference } from "./codes-timer.js";
import { stopTicker } from "./codes-timer.js";

let bootstrapStarted = false;

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
  cross.search?.reset?.();
  renderAccounts([]);
}

/** Wires codes list scroll behavior. */
export function initCodes() {
  initCodesListWheelSnap();
}

/** Loads codes once after auth chrome is applied. */
export async function bootstrapCodesOnce() {
  if (bootstrapStarted) {
    return;
  }

  bootstrapStarted = true;

  try {
    await initPopupResume();
    await initOnLoad();
  } catch {
    // Startup sync or section init failed.
  }
}

/** Syncs and renders codes; runs review prompt or pending QR scan when appropriate. */
async function initOnLoad() {
  setShouldPlayCodesIntro(false);

  const authNumber = await authNumberGet();

  if (!authNumber) {
    renderAccounts([]);
  } else if (hasPendingPostLoginReveal()) {
    // Post-login reveal runs when user menu closes.
  } else {
    await loadTimerInvertedPreference();
    const accounts = await dataSync(authNumber);
    renderAccounts(accounts);
  }

  if (getPopupResumePending()) {
    await cross.qrCodeSetup.processPendingScan({ instantOpen: true });
  } else if (!hasPendingPostLoginReveal()) {
    await cross.reviewPrompt.maybeShowOnInit();
  }
}
