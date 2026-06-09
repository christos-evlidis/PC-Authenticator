import { AUTH_NUMBER_KEY } from "../../constants.js";

/** Persists the signed-in account number after login or account creation. */
async function authStorageSet(authNumber) {
  try {
    await chrome.storage.local.set({
      [AUTH_NUMBER_KEY]: authNumber,
    });
  } catch (error) {
    console.warn("[auth-storage] authStorageSet failed", error);
    throw error;
  }
}

export { authStorageSet };
