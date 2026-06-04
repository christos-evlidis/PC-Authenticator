import { setHeaderActionsEnabled } from "./codes-auth-chrome.js";

export const PIE_CENTER = 16;
export const PIE_ARC_RADIUS = 15;
export const TIMER_INVERTED_KEY = "timerInverted";

export const SELECTORS = {
  section: ".codes-section",
  empty: ".codes-section__empty",
  list: ".codes-section__list",
  template: ".code-card-template",
};

export const EMAIL_PLACEHOLDER = "placeholder@example.com";
export const DEFAULT_CONTACT = "user@example.com";
export const DELETE_SLIDE_MS = 280;
export const CODE_CARD_SLIDE_MS = 150;
export const CODE_INTRO_SLIDE_MS = 250;
export const CODE_INTRO_STAGGER_MS = 225;
export const EMPTY_ICON_POP_MS = 250;
export const EMPTY_TYPE_MS = 1000;
export const EMPTY_SIGNED_IN_ICON_CLASS = "fa-key";
export const EMPTY_SIGNED_IN_MESSAGE =
  "Add your first code.\nUse + or scan a QR code to get started.";
export const LIST_WHEEL_COOLDOWN_MS = 380;

export let shouldPlayCodesIntro = true;
export let pendingPostLoginReveal = null;
export let tickIntervalId = null;
export let cardRoots = [];
export let globalTimerInverted = false;
export let globalLastTimerPeriod = null;
export let headerLockedForEdit = false;
export let headerLockedForDelete = false;

export function updateHeaderActionsLock() {
  const locked = headerLockedForEdit || headerLockedForDelete;
  setHeaderActionsEnabled(!locked);
}

export function setEditHeaderLock(locked) {
  headerLockedForEdit = locked;
  updateHeaderActionsLock();
}

export function setDeleteHeaderLock(locked) {
  headerLockedForDelete = locked;
  updateHeaderActionsLock();
}

export function getElements() {
  return {
    empty: document.querySelector(SELECTORS.empty),
    list: document.querySelector(SELECTORS.list),
    template: document.querySelector(SELECTORS.template),
  };
}

export function findCardRoot(card) {
  return cardRoots.find((root) => root.card === card);
}

export function removeCardRoot(card) {
  cardRoots = cardRoots.filter((root) => root.card !== card);
}

export function pushCardRoot(root) {
  cardRoots.push(root);
}

export function setCardRoots(roots) {
  cardRoots = roots;
}

export function clearCardRoots() {
  cardRoots = [];
}

export function getCardRoots() {
  return cardRoots;
}

/**
 * Re-syncs cardRoots order with the current list DOM (excludes spacers).
 *
 * @param {Element | null | undefined} [list]
 */
export function refreshCardRootsFromList(list = document.querySelector(SELECTORS.list)) {
  if (!list) {
    return;
  }

  const cards = list.querySelectorAll(
    ".account-block:not(.account-block--manual-add-spacer):not(.account-block--exit-spacer)",
  );
  const roots = [];

  for (const card of cards) {
    const root = cardRoots.find((entry) => entry.card === card);

    if (root) {
      roots.push(root);
    }
  }

  cardRoots = roots;
}

export function getShouldPlayCodesIntro() {
  return shouldPlayCodesIntro;
}

export function setShouldPlayCodesIntro(value) {
  shouldPlayCodesIntro = value;
}

export function getPendingPostLoginReveal() {
  return pendingPostLoginReveal;
}

export function setPendingPostLoginReveal(value) {
  pendingPostLoginReveal = value;
}

export function getTickIntervalId() {
  return tickIntervalId;
}

export function setTickIntervalId(value) {
  tickIntervalId = value;
}

export function getGlobalTimerInverted() {
  return globalTimerInverted;
}

export function setGlobalTimerInverted(value) {
  globalTimerInverted = value;
}

export function getGlobalLastTimerPeriod() {
  return globalLastTimerPeriod;
}

export function setGlobalLastTimerPeriod(value) {
  globalLastTimerPeriod = value;
}

