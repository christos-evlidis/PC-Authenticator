import { DATA_KEY_PENDING } from "../data-constants.js";

/** Runs a storage operation and logs failures. */
async function dataStorageLogWarn(operation, fn) {
  try {
    return await fn();
  } catch (error) {
    console.warn(`[data-storage] ${operation} failed`, error);
    throw error;
  }
}

/** Reads pending accounts queued before merge/upload. */
export async function dataStorageGetPending() {
  return dataStorageLogWarn("dataStorageGetPending", async () => {
    const stored = await chrome.storage.local.get([DATA_KEY_PENDING]);
    return stored[DATA_KEY_PENDING];
  });
}

/** Writes the pending accounts queue. */
export async function dataStorageSetPending(accounts) {
  return dataStorageLogWarn("dataStorageSetPending", () =>
    chrome.storage.local.set({ [DATA_KEY_PENDING]: accounts }),
  );
}

/** Clears the pending accounts queue. */
export async function dataStorageClearPending() {
  return dataStorageLogWarn("dataStorageClearPending", () =>
    chrome.storage.local.remove([DATA_KEY_PENDING]),
  );
}

/** Appends one account to the pending queue. */
export async function dataStorageAppendPending(account) {
  return dataStorageLogWarn("dataStorageAppendPending", async () => {
    const pending = await dataStorageGetPending();
    await dataStorageSetPending([
      ...(Array.isArray(pending) ? pending : []),
      account,
    ]);
  });
}
