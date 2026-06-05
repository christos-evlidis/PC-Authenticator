import { AUTH_NUMBER_LENGTH } from "./auth-constants.js";

/** Sanitizes account-number input so auth flows only accept digit strings. */
export function authSanitize(value) {
  return String(value ?? "")
    .replace(/\D/g, "")
    .slice(0, AUTH_NUMBER_LENGTH);
}
