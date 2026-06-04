import { ACCOUNT_NUMBER_LENGTH } from "./constants.js";

/** Sanitizes account-number input so auth flows only accept digit strings. */
export function accountNumberSanitize(value) {
  return String(value ?? "")
    .replace(/\D/g, "")
    .slice(0, ACCOUNT_NUMBER_LENGTH);
}
