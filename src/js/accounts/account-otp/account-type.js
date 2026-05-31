import { HOTP_TYPE } from "../account-constants.js";
import { TOTP_TYPE } from "../account-constants.js";

/** Returns whether the account uses HOTP (counter-based). */
export function accountHotpIs(account) {
  return account.type === HOTP_TYPE;
}

/** Returns whether the account uses TOTP (time-based). */
export function accountTotpIs(account) {
  return account.type === TOTP_TYPE;
}
