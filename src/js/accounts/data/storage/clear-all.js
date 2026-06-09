import { dataClear } from "./final.js";
import { dataClearMerged } from "./merged.js";
import { dataClearPending } from "./pending.js";
import { dataClearRestored } from "./restored.js";

import { DATA_KEY_LEGACY } from "../constants.js";

/** Runs a storage operation and logs failures. */
async function logWarn(operation, fn) {
  try {
    return await fn();
  } catch (error) {
    console.warn(`[data-storage] ${operation} failed`, error);
    throw error;
  }
}

/** Clears all account-related keys from local storage (sign-out / reset). */
async function dataClearAll() {
  return logWarn("dataClearAll", async () => {
    await dataClear();
    await dataClearRestored();
    await dataClearPending();
    await dataClearMerged();
    await chrome.storage.local.remove(DATA_KEY_LEGACY);
  });
}

export { dataClearAll };
