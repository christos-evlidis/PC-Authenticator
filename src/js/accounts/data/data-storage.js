import { ACCOUNTS_ENCRYPTED_KEY } from "./data-constants.js";
import { ACCOUNTS_FINAL_KEY } from "./data-constants.js";
import { ACCOUNTS_LEGACY_KEYS } from "./data-constants.js";
import { ACCOUNTS_MERGED_KEY } from "./data-constants.js";
import { ACCOUNTS_UNENCRYPTED_KEY } from "./data-constants.js";

/** Runs a storage operation and logs failures. */
async function dataStorageWarn(operation, fn) {
  try {
    return await fn();
  } catch (error) {
    console.warn(`[data-storage] ${operation} failed`, error);
    throw error;
  }
}

/** Reads the final (active) account list from local storage. */
export async function dataFinalGet() {
  return dataStorageWarn("dataFinalGet", async () => {
    const stored = await chrome.storage.local.get([ACCOUNTS_FINAL_KEY]);
    return stored[ACCOUNTS_FINAL_KEY];
  });
}

/** Writes the final (active) account list to local storage. */
export async function dataFinalSet(accounts) {
  return dataStorageWarn("dataFinalSet", () =>
    chrome.storage.local.set({ [ACCOUNTS_FINAL_KEY]: accounts }),
  );
}

/** Clears the final (active) account list from local storage. */
export async function dataFinalClear() {
  return dataStorageWarn("dataFinalClear", () =>
    chrome.storage.local.remove([ACCOUNTS_FINAL_KEY]),
  );
}

/** Reads the cached encrypted backup blob. */
export async function dataEncryptedGet() {
  return dataStorageWarn("dataEncryptedGet", async () => {
    const stored = await chrome.storage.local.get([ACCOUNTS_ENCRYPTED_KEY]);
    return stored[ACCOUNTS_ENCRYPTED_KEY];
  });
}

/** Writes the cached encrypted backup blob. */
export async function dataEncryptedSet(encryptedBlob) {
  return dataStorageWarn("dataEncryptedSet", () =>
    chrome.storage.local.set({ [ACCOUNTS_ENCRYPTED_KEY]: encryptedBlob }),
  );
}

/** Clears the cached encrypted backup blob. */
export async function dataEncryptedClear() {
  return dataStorageWarn("dataEncryptedClear", () =>
    chrome.storage.local.remove([ACCOUNTS_ENCRYPTED_KEY]),
  );
}

/** Reads pending accounts queued before merge/upload. */
export async function dataPendingGet() {
  return dataStorageWarn("dataPendingGet", async () => {
    const stored = await chrome.storage.local.get([ACCOUNTS_UNENCRYPTED_KEY]);
    return stored[ACCOUNTS_UNENCRYPTED_KEY];
  });
}

/** Writes the pending accounts queue. */
export async function dataPendingSet(accounts) {
  return dataStorageWarn("dataPendingSet", () =>
    chrome.storage.local.set({ [ACCOUNTS_UNENCRYPTED_KEY]: accounts }),
  );
}

/** Clears the pending accounts queue. */
export async function dataPendingClear() {
  return dataStorageWarn("dataPendingClear", () =>
    chrome.storage.local.remove([ACCOUNTS_UNENCRYPTED_KEY]),
  );
}

/** Appends one account to the pending queue. */
export async function dataPendingAppend(account) {
  return dataStorageWarn("dataPendingAppend", async () => {
    const pending = await dataPendingGet();
    await dataPendingSet([
      ...(Array.isArray(pending) ? pending : []),
      account,
    ]);
  });
}

/** Reads the temporary merged list used during add/sync flows. */
export async function dataMergedGet() {
  return dataStorageWarn("dataMergedGet", async () => {
    const stored = await chrome.storage.local.get([ACCOUNTS_MERGED_KEY]);
    return stored[ACCOUNTS_MERGED_KEY];
  });
}

/** Writes the temporary merged list. */
export async function dataMergedSet(accounts) {
  return dataStorageWarn("dataMergedSet", () =>
    chrome.storage.local.set({ [ACCOUNTS_MERGED_KEY]: accounts }),
  );
}

/** Clears the temporary merged list. */
export async function dataMergedClear() {
  return dataStorageWarn("dataMergedClear", () =>
    chrome.storage.local.remove([ACCOUNTS_MERGED_KEY]),
  );
}

/** Clears all account-related keys from local storage (sign-out / reset). */
export async function dataClear() {
  return dataStorageWarn("dataClear", async () => {
    await dataFinalClear();
    await dataEncryptedClear();
    await dataPendingClear();
    await dataMergedClear();
    await chrome.storage.local.remove(ACCOUNTS_LEGACY_KEYS);
  });
}
