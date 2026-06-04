import { HOTP_TYPE } from "../account-constants.js";
import { TOTP_TYPE } from "../account-constants.js";

/** Returns whether the account uses HOTP (counter-based). */
export function accountHotpIs(account) {
  try {
    return account.type === HOTP_TYPE;
  } catch (error) {
    console.warn("[account-otp] accountHotpIs failed", error);
    return false;
  }
}

/** Returns whether the account uses TOTP (time-based). */
export function accountTotpIs(account) {
  try {
    return account.type === TOTP_TYPE;
  } catch (error) {
    console.warn("[account-otp] accountTotpIs failed", error);
    return false;
  }
}
