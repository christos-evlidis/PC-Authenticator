import { USER_MENU_ACCOUNT_NUMBER_LENGTH } from "./constants.js";

// Sanitizes account-number input so auth flows only work with valid digits.
export function userMenuAccountSanitize(value) {
  return String(value ?? "")
    .replace(/\D/g, "")
    .slice(0, USER_MENU_ACCOUNT_NUMBER_LENGTH);
}
