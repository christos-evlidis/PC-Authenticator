import { USER_MENU_ACCOUNT_INPUT_SELECTOR } from "../constants.js";

/** Updates the read-only account number field in the DOM. */
export function userMenuAccountApply(accountNumber) {
  const input = document.querySelector(USER_MENU_ACCOUNT_INPUT_SELECTOR);

  if (input) {
    input.value = accountNumber ?? "";
  }
}
