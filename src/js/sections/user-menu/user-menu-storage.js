import { USER_MENU_ACCOUNT_NUMBER_KEY } from "./user-menu-constants.js";

/** Persists the signed-in account number after login or account creation. */
export async function userMenuAccountSet(accountNumber) {
  await chrome.storage.local.set({
    [USER_MENU_ACCOUNT_NUMBER_KEY]: accountNumber,
  });
}

/** Removes the signed-in account number during sign-out/reset flows. */
export async function userMenuAccountClear() {
  await chrome.storage.local.remove([USER_MENU_ACCOUNT_NUMBER_KEY]);
}
