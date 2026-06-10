import { AUTH_NUMBER_KEY } from "../../constants.js";

async function authStorageClear() {
  try {
    await chrome.storage.local.remove([AUTH_NUMBER_KEY]);
  } catch (error) {
    console.warn("[auth-storage] authStorageClear failed", error);
    throw error;
  }
}

export { authStorageClear };
