import { ACCOUNTS_ENCRYPTED_KEY } from "./account-constants.js";
import { ACCOUNTS_FINAL_KEY } from "./account-constants.js";
import { ACCOUNTS_LEGACY_KEYS } from "./account-constants.js";
import { ACCOUNTS_MERGED_KEY } from "./account-constants.js";
import { ACCOUNTS_UNENCRYPTED_KEY } from "./account-constants.js";

/** Runs a storage operation and logs failures. */
async function accountStorageWarn(operation, fn) {
  try {
    return await fn();
  } catch (error) {
    console.warn(`[account-storage] ${operation} failed`, error);
    throw error;
  }
}

/** Reads the final (active) account list from local storage. */
export async function accountsFinalGet() {
  return accountStorageWarn("accountsFinalGet", async () => {
    const stored = await chrome.storage.local.get([ACCOUNTS_FINAL_KEY]);
    return stored[ACCOUNTS_FINAL_KEY];
  });
}

/** Writes the final (active) account list to local storage. */
export async function accountsFinalSet(accounts) {
  return accountStorageWarn("accountsFinalSet", () =>
    chrome.storage.local.set({ [ACCOUNTS_FINAL_KEY]: accounts }),
  );
}

/** Clears the final (active) account list from local storage. */
export async function accountsFinalClear() {
  return accountStorageWarn("accountsFinalClear", () =>
    chrome.storage.local.remove([ACCOUNTS_FINAL_KEY]),
  );
}

/** Reads the cached encrypted backup blob. */
export async function accountsEncryptedGet() {
  return accountStorageWarn("accountsEncryptedGet", async () => {
    const stored = await chrome.storage.local.get([ACCOUNTS_ENCRYPTED_KEY]);
    return stored[ACCOUNTS_ENCRYPTED_KEY];
  });
}

/** Writes the cached encrypted backup blob. */
export async function accountsEncryptedSet(encryptedBlob) {
  return accountStorageWarn("accountsEncryptedSet", () =>
    chrome.storage.local.set({ [ACCOUNTS_ENCRYPTED_KEY]: encryptedBlob }),
  );
}

/** Clears the cached encrypted backup blob. */
export async function accountsEncryptedClear() {
  return accountStorageWarn("accountsEncryptedClear", () =>
    chrome.storage.local.remove([ACCOUNTS_ENCRYPTED_KEY]),
  );
}

/** Reads pending accounts queued before merge/upload. */
export async function accountsPendingGet() {
  return accountStorageWarn("accountsPendingGet", async () => {
    const stored = await chrome.storage.local.get([ACCOUNTS_UNENCRYPTED_KEY]);
    return stored[ACCOUNTS_UNENCRYPTED_KEY];
  });
}

/** Writes the pending accounts queue. */
export async function accountsPendingSet(accounts) {
  return accountStorageWarn("accountsPendingSet", () =>
    chrome.storage.local.set({ [ACCOUNTS_UNENCRYPTED_KEY]: accounts }),
  );
}

/** Clears the pending accounts queue. */
export async function accountsPendingClear() {
  return accountStorageWarn("accountsPendingClear", () =>
    chrome.storage.local.remove([ACCOUNTS_UNENCRYPTED_KEY]),
  );
}

/** Appends one account to the pending queue. */
export async function accountsPendingAppend(account) {
  return accountStorageWarn("accountsPendingAppend", async () => {
    const pending = await accountsPendingGet();
    await accountsPendingSet([
      ...(Array.isArray(pending) ? pending : []),
      account,
    ]);
  });
}

/** Reads the temporary merged list used during add/sync flows. */
export async function accountsMergedGet() {
  return accountStorageWarn("accountsMergedGet", async () => {
    const stored = await chrome.storage.local.get([ACCOUNTS_MERGED_KEY]);
    return stored[ACCOUNTS_MERGED_KEY];
  });
}

/** Writes the temporary merged list. */
export async function accountsMergedSet(accounts) {
  return accountStorageWarn("accountsMergedSet", () =>
    chrome.storage.local.set({ [ACCOUNTS_MERGED_KEY]: accounts }),
  );
}

/** Clears the temporary merged list. */
export async function accountsMergedClear() {
  return accountStorageWarn("accountsMergedClear", () =>
    chrome.storage.local.remove([ACCOUNTS_MERGED_KEY]),
  );
}

/** Clears all account-related keys from local storage (sign-out / reset). */
export async function accountsClear() {
  return accountStorageWarn("accountsClear", async () => {
    await accountsFinalClear();
    await accountsEncryptedClear();
    await accountsPendingClear();
    await accountsMergedClear();
    await chrome.storage.local.remove(ACCOUNTS_LEGACY_KEYS);
  });
}
