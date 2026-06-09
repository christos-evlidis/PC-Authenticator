import { DATA_KEY_PENDING } from "../constants.js";

/** Runs a storage operation and logs failures. */
async function logWarn(operation, fn) {
  try {
    return await fn();
  } catch (error) {
    console.warn(`[data-storage] ${operation} failed`, error);
    throw error;
  }
}

/** Reads pending accounts queued before dataMerge/upload. */
async function dataGetPending() {
  return logWarn("dataGetPending", async () => {
    const stored = await chrome.storage.local.get([DATA_KEY_PENDING]);
    return stored[DATA_KEY_PENDING];
  });
}

/** Writes the pending accounts queue. */
async function dataSetPending(accounts) {
  return logWarn("dataSetPending", () =>
    chrome.storage.local.set({ [DATA_KEY_PENDING]: accounts }),
  );
}

/** Clears the pending accounts queue. */
async function dataClearPending() {
  return logWarn("dataClearPending", () =>
    chrome.storage.local.remove([DATA_KEY_PENDING]),
  );
}

/** Appends one account to the pending queue. */
async function dataAppendPending(account) {
  return logWarn("dataAppendPending", async () => {
    const pending = await dataGetPending();
    await dataSetPending([
      ...(Array.isArray(pending) ? pending : []),
      account,
    ]);
  });
}

export { dataGetPending };
export { dataSetPending };
export { dataClearPending };
export { dataAppendPending };
