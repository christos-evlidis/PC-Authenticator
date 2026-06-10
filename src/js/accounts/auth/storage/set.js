import { AUTH_NUMBER_KEY } from "../../accounts-const.js";

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
