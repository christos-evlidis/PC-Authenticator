import { cross } from "../section-cross.js";
import { authNumberGet } from "../../accounts/accounts-index.js";
import { getElements } from "./codes-state.js";
import { getPendingPostLoginReveal } from "./codes-state.js";
import { setPendingPostLoginReveal } from "./codes-state.js";
import { renderAccounts } from "./codes-cards.js";
import { setEmptyVisible } from "./codes-empty.js";
import { playCodesEmptyIntro } from "./codes-empty.js";
import { revealCodesSearchStatic } from "./codes-search.js";

/** Queues accounts to reveal after the post-login user-menu animation. */
export function stagePostLoginReveal(accounts) {
  setPendingPostLoginReveal(Array.isArray(accounts) ? accounts : []);
}

/** Clears any pending post-login reveal state. */
export function cancelPendingPostLoginReveal() {
  setPendingPostLoginReveal(null);
}

/** Returns whether a post-login reveal is waiting to run. */
export function hasPendingPostLoginReveal() {
  return getPendingPostLoginReveal() != null;
}

/** Hides codes content and applies signed-in chrome before the reveal animation. */
export async function preparePostLoginReveal() {
  const authNumber = await authNumberGet();
  cross.codes.setAuthState(true, { authNumber });
  hideCodesSectionContent();
}

/** Restores signed-out chrome after logout without replaying the animation. */
export async function applyPostLogoutChrome() {
  cancelPendingPostLoginReveal();
  await cross.codes.refreshAuthState({
    skipSignedOutReveal: true,
    bodyStaticReveal: true,
  });
}

/** Hides empty/list containers while the post-login reveal is staged. */
function hideCodesSectionContent() {
  const { empty, list } = getElements();
  empty?.classList.add("hidden");
  list?.classList.add("hidden");
}

/** Plays the post-login codes reveal after the user menu closes. */
export async function playPostLoginReveal() {
  if (getPendingPostLoginReveal() == null) {
    return;
  }

  const accounts = getPendingPostLoginReveal();
  setPendingPostLoginReveal(null);

  const renderableAccounts = accounts.filter((account) => account?.secret);

  cross.codes.setAuthState(true, { authNumber: await authNumberGet() });
  revealCodesSearchStatic();

  if (!renderableAccounts.length) {
    const { empty, list } = getElements();

    setEmptyVisible(empty, list, true);
    await playCodesEmptyIntro();
  } else {
    renderAccounts(accounts);
  }
}
