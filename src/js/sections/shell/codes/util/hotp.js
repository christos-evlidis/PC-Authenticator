import { DATA_COUNTER_MIN } from "../../../../accounts/accounts-index.js";
import { DATA_HOTP_COUNTER_DEFAULT } from "../../../../accounts/accounts-index.js";

/** Returns the numeric HOTP counter for an account. */
function codesUtilHotpCounterValue(account) {
  return Number.isInteger(account?.counter) ? account.counter : DATA_HOTP_COUNTER_DEFAULT;
}

/** Returns HOTP counter text for display on a card. */
function codesUtilHotpCounterDisplay(account) {
  return String(codesUtilHotpCounterValue(account));
}

/** Parses user-entered HOTP counter text. */
function codesUtilHotpCounterParse(text) {
  const trimmed = String(text ?? "").trim();

  if (!/^\d+$/.test(trimmed)) {
    return null;
  }

  const counter = Number.parseInt(trimmed, 10);

  if (!Number.isInteger(counter) || counter < DATA_COUNTER_MIN) {
    return null;
  }

  return counter;
}

export { codesUtilHotpCounterDisplay };
export { codesUtilHotpCounterParse };
export { codesUtilHotpCounterValue };
