import { AUTH_NUMBER_KEY } from "../../constants.js";

/** Removes the signed-in account number during sign-out or reset flows. */
async function authStorageClear() {
  try {
    await chrome.storage.local.remove([AUTH_NUMBER_KEY]);
  } catch (error) {
    console.warn("[auth-storage] authStorageClear failed", error);
    throw error;
  }
}

export { authStorageClear };
