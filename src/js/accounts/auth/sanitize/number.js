import { AUTH_NUMBER_LENGTH } from "../../constants.js";

function authSanitizeNumber(value) {
  return String(value ?? "")
    .replace(/\D/g, "")
    .slice(0, AUTH_NUMBER_LENGTH);
}

export { authSanitizeNumber };
