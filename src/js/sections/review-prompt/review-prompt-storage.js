import { dataStorageGetFinal } from "../../accounts/accounts-index.js";
import { getPopupResumePending } from "../../popup-resume/popup-resume.js";
import { whenPopupResumeReady } from "../../popup-resume/popup-resume.js";
import { getVerifiedAuthNumber } from "../../utils/utility-auth.js";

export const STORE_REVIEWS_URL =
  "https://chromewebstore.google.com/detail/authenticator-for-pc/ppkkcfblhfgmdmefkmkoomenhgecbemi/reviews";

export const STORAGE_KEYS = {
  firstPopupAt: "reviewPromptFirstPopupAt",
  openedAt: "reviewPromptOpenedAt",
  dismissedAt: "reviewPromptDismissedAt",
  lastShownAt: "reviewPromptLastShownAt",
};

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function readStorageTimestamp(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export async function getReviewPromptTimestamps() {
  if (typeof chrome === "undefined" || !chrome.storage?.local) {
    return {
      firstPopupAt: null,
      openedAt: null,
      dismissedAt: null,
      lastShownAt: null,
    };
  }

  const stored = await chrome.storage.local.get(Object.values(STORAGE_KEYS));

  return {
    firstPopupAt: readStorageTimestamp(stored[STORAGE_KEYS.firstPopupAt]),
    openedAt: readStorageTimestamp(stored[STORAGE_KEYS.openedAt]),
    dismissedAt: readStorageTimestamp(stored[STORAGE_KEYS.dismissedAt]),
    lastShownAt: readStorageTimestamp(stored[STORAGE_KEYS.lastShownAt]),
  };
}

export async function recordFirstPopupOpen() {
  if (typeof chrome === "undefined" || !chrome.storage?.local) {
    return;
  }

  const stored = await chrome.storage.local.get([STORAGE_KEYS.firstPopupAt]);

  if (readStorageTimestamp(stored[STORAGE_KEYS.firstPopupAt])) {
    return;
  }

  await chrome.storage.local.set({
    [STORAGE_KEYS.firstPopupAt]: Date.now(),
  });
}

export async function markLastShownAt() {
  if (typeof chrome === "undefined" || !chrome.storage?.local) {
    return;
  }

  await chrome.storage.local.set({
    [STORAGE_KEYS.lastShownAt]: Date.now(),
  });
}

export async function markOpenedAt() {
  if (typeof chrome === "undefined" || !chrome.storage?.local) {
    return;
  }

  await chrome.storage.local.set({
    [STORAGE_KEYS.openedAt]: Date.now(),
  });
}

export async function markDismissedAt() {
  if (typeof chrome === "undefined" || !chrome.storage?.local) {
    return;
  }

  await chrome.storage.local.set({
    [STORAGE_KEYS.dismissedAt]: Date.now(),
  });
}

function hasElapsedSince(timestamp, ms) {
  return timestamp != null && Date.now() - timestamp >= ms;
}

async function hasSavedAccount() {
  const accounts = (await dataStorageGetFinal()) ?? [];
  return accounts.some((account) => account?.secret);
}

export async function shouldShowReviewPrompt() {
  const timestamps = await getReviewPromptTimestamps();

  if (timestamps.openedAt != null) {
    return false;
  }

  await whenPopupResumeReady();

  if (getPopupResumePending()) {
    return false;
  }

  if (typeof chrome === "undefined" || !chrome.storage?.local) {
    return false;
  }

  const authNumber = await getVerifiedAuthNumber();

  if (!authNumber) {
    return false;
  }

  if (!(await hasSavedAccount())) {
    return false;
  }

  if (!hasElapsedSince(timestamps.firstPopupAt, SEVEN_DAYS_MS)) {
    return false;
  }

  if (
    timestamps.dismissedAt != null &&
    !hasElapsedSince(timestamps.dismissedAt, SEVEN_DAYS_MS)
  ) {
    return false;
  }

  return true;
}
