import { cross } from "../section-cross.js";
import { getElements } from "./codes-state.js";
import { getPendingPostLoginReveal } from "./codes-state.js";
import { setPendingPostLoginReveal } from "./codes-state.js";
import { renderAccounts } from "./codes-cards.js";
import { revealCodesEmptyStatic } from "./codes-empty.js";
import { revealCodesSearchStatic } from "./codes-search.js";

export function stagePostLoginReveal(accounts) {
  setPendingPostLoginReveal(Array.isArray(accounts) ? accounts : []);
}

export function cancelPendingPostLoginReveal() {
  setPendingPostLoginReveal(null);
}

export function hasPendingPostLoginReveal() {
  return getPendingPostLoginReveal() != null;
}

export function preparePostLoginReveal() {
  cross.codes.setAuthState(true);
  hideCodesSectionContent();
}

export async function applyPostLogoutChrome() {
  cancelPendingPostLoginReveal();
  await cross.codes.refreshAuthState({
    skipSignedOutReveal: true,
    bodyStaticReveal: true,
  });
}

function hideCodesSectionContent() {
  const { empty, list } = getElements();
  empty?.classList.add("hidden");
  list?.classList.add("hidden");
}

export async function playPostLoginReveal() {
  if (getPendingPostLoginReveal() == null) {
    return;
  }

  const accounts = getPendingPostLoginReveal();
  setPendingPostLoginReveal(null);

  const renderableAccounts = accounts.filter((account) => account?.secret);

  cross.codes.setAuthState(true);
  revealCodesSearchStatic();

  if (!renderableAccounts.length) {
    const { empty, list } = getElements();
    list?.classList.add("hidden");
    empty?.classList.remove("hidden");
    revealCodesEmptyStatic();
  } else {
    renderAccounts(accounts);
  }
}
