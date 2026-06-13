import { codesStateStore } from "../state/store.js";

import { CODES_TIMER_INVERTED_KEY } from "../../../../const/const.codes.js";

/** Loads global timer invert preference from storage. */
async function codesUtilTimerPreferenceLoad() {
  try {
    const stored = await chrome.storage.local.get([CODES_TIMER_INVERTED_KEY]);
    codesStateStore.globalTimerInverted = Boolean(stored[CODES_TIMER_INVERTED_KEY]);
  } catch {
    codesStateStore.globalTimerInverted = false;
  }
}

/** Persists global timer invert preference to storage. */
async function codesUtilTimerPreferenceSave(inverted) {
  codesStateStore.globalTimerInverted = inverted;

  try {
    await chrome.storage.local.set({ [CODES_TIMER_INVERTED_KEY]: inverted });
  } catch {
    // ignore persistence errors
  }
}

export { codesUtilTimerPreferenceLoad };
export { codesUtilTimerPreferenceSave };
