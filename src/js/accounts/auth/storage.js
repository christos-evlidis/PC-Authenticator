import { ACCOUNT_NUMBER_KEY } from "./constants.js";

/** Runs a storage operation and logs failures. */
async function accountAuthStorageWarn(operation, fn) {
  try {
    return await fn();
  } catch (error) {
    console.warn(`[account-auth-storage] ${operation} failed`, error);
    throw error;
  }
}

/** Reads the signed-in account number from local storage, or null when absent. */
export async function accountNumberGet() {
  return accountAuthStorageWarn("accountNumberGet", async () => {
    const stored = await chrome.storage.local.get([ACCOUNT_NUMBER_KEY]);
    return stored[ACCOUNT_NUMBER_KEY] ?? null;
  });
}

/** Persists the signed-in account number after login or account creation. */
export async function accountNumberSet(accountNumber) {
  return accountAuthStorageWarn("accountNumberSet", () =>
    chrome.storage.local.set({
      [ACCOUNT_NUMBER_KEY]: accountNumber,
    }),
  );
}

/** Removes the signed-in account number during sign-out or reset flows. */
export async function accountNumberClear() {
  return accountAuthStorageWarn("accountNumberClear", () =>
    chrome.storage.local.remove([ACCOUNT_NUMBER_KEY]),
  );
}
