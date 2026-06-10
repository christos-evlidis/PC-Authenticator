import { CODES_DEFAULT_CONTACT } from "../codes-const.js";
import { CODES_EMAIL_PLACEHOLDER } from "../codes-const.js";

/** Normalizes editable contact text, treating placeholder as empty. */
function codesUtilContactNormalize(text) {
  const trimmed = String(text ?? "").trim();

  if (!trimmed || trimmed === CODES_EMAIL_PLACEHOLDER) {
    return "";
  }

  return trimmed;
}

/** Returns the contact line shown on an account card. */
function codesUtilContactDisplay(account) {
  if (account.email) {
    return account.email;
  }

  if (account.username) {
    return account.username;
  }

  return CODES_EMAIL_PLACEHOLDER;
}

/** Returns whether a string is a valid email address. */
function codesUtilEmailValid(email) {
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
}

export { CODES_DEFAULT_CONTACT };
export { codesUtilContactDisplay };
export { codesUtilContactNormalize };
export { codesUtilEmailValid };
