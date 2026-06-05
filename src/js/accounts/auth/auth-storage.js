import { AUTH_NUMBER_KEY } from "./auth-constants.js";

/** Runs a storage operation and logs failures. */
async function authStorageWarn(operation, fn) {
  try {
    return await fn();
  } catch (error) {
    console.warn(`[auth-storage] ${operation} failed`, error);
    throw error;
  }
}

/** Reads the signed-in account number from local storage, or null when absent. */
export async function authNumberGet() {
  return authStorageWarn("authNumberGet", async () => {
    const stored = await chrome.storage.local.get([AUTH_NUMBER_KEY]);
    return stored[AUTH_NUMBER_KEY] ?? null;
  });
}

/** Persists the signed-in account number after login or account creation. */
export async function authNumberSet(accountNumber) {
  return authStorageWarn("authNumberSet", () =>
    chrome.storage.local.set({
      [AUTH_NUMBER_KEY]: accountNumber,
    }),
  );
}

/** Removes the signed-in account number during sign-out or reset flows. */
export async function authNumberClear() {
  return authStorageWarn("authNumberClear", () =>
    chrome.storage.local.remove([AUTH_NUMBER_KEY]),
  );
}
