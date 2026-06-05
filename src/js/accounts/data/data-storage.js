import { DATA_KEY_ENCRYPTED } from "./data-constants.js";
import { DATA_KEY_FINAL } from "./data-constants.js";
import { DATA_KEY_LEGACY } from "./data-constants.js";
import { DATA_KEY_MERGED } from "./data-constants.js";
import { DATA_KEY_PENDING } from "./data-constants.js";

/** Runs a storage operation and logs failures. */
async function dataStorageLogWarn(operation, fn) {
  try {
    return await fn();
  } catch (error) {
    console.warn(`[data-storage] ${operation} failed`, error);
    throw error;
  }
}

/** Reads the final (active) account list from local storage. */
export async function dataStorageGetFinal() {
  return dataStorageLogWarn("dataStorageGetFinal", async () => {
    const stored = await chrome.storage.local.get([DATA_KEY_FINAL]);
    return stored[DATA_KEY_FINAL];
  });
}

/** Writes the final (active) account list to local storage. */
export async function dataStorageSetFinal(accounts) {
  return dataStorageLogWarn("dataStorageSetFinal", () =>
    chrome.storage.local.set({ [DATA_KEY_FINAL]: accounts }),
  );
}

/** Clears the final (active) account list from local storage. */
export async function dataStorageClearFinal() {
  return dataStorageLogWarn("dataStorageClearFinal", () =>
    chrome.storage.local.remove([DATA_KEY_FINAL]),
  );
}

/** Reads the cached encrypted backup blob. */
export async function dataStorageGetEncrypted() {
  return dataStorageLogWarn("dataStorageGetEncrypted", async () => {
    const stored = await chrome.storage.local.get([DATA_KEY_ENCRYPTED]);
    return stored[DATA_KEY_ENCRYPTED];
  });
}

/** Writes the cached encrypted backup blob. */
export async function dataStorageSetEncrypted(encryptedBlob) {
  return dataStorageLogWarn("dataStorageSetEncrypted", () =>
    chrome.storage.local.set({ [DATA_KEY_ENCRYPTED]: encryptedBlob }),
  );
}

/** Clears the cached encrypted backup blob. */
export async function dataStorageClearEncrypted() {
  return dataStorageLogWarn("dataStorageClearEncrypted", () =>
    chrome.storage.local.remove([DATA_KEY_ENCRYPTED]),
  );
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

/** Reads the temporary merged list used during add/sync flows. */
export async function dataStorageGetMerged() {
  return dataStorageLogWarn("dataStorageGetMerged", async () => {
    const stored = await chrome.storage.local.get([DATA_KEY_MERGED]);
    return stored[DATA_KEY_MERGED];
  });
}

/** Writes the temporary merged list. */
export async function dataStorageSetMerged(accounts) {
  return dataStorageLogWarn("dataStorageSetMerged", () =>
    chrome.storage.local.set({ [DATA_KEY_MERGED]: accounts }),
  );
}

/** Clears the temporary merged list. */
export async function dataStorageClearMerged() {
  return dataStorageLogWarn("dataStorageClearMerged", () =>
    chrome.storage.local.remove([DATA_KEY_MERGED]),
  );
}

/** Clears all account-related keys from local storage (sign-out / reset). */
export async function dataStorageClearAll() {
  return dataStorageLogWarn("dataStorageClearAll", async () => {
    await dataStorageClearFinal();
    await dataStorageClearEncrypted();
    await dataStorageClearPending();
    await dataStorageClearMerged();
    await chrome.storage.local.remove(DATA_KEY_LEGACY);
  });
}
