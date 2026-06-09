import { AUTH_NUMBER_KEY } from "../../constants.js";

/** Reads the signed-in account number from local storage, or null when absent. */
async function authStorageGet() {
  try {
    const stored = await chrome.storage.local.get([AUTH_NUMBER_KEY]);
    return stored[AUTH_NUMBER_KEY] ?? null;
  } catch (error) {
    console.warn("[auth-storage] authStorageGet failed", error);
    throw error;
  }
}

export { authStorageGet };
