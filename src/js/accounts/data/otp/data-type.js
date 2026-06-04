import { HOTP_TYPE } from "../data-constants.js";
import { TOTP_TYPE } from "../data-constants.js";

/** Returns whether the account uses HOTP (counter-based). */
export function dataHotpIs(account) {
  try {
    return account.type === HOTP_TYPE;
  } catch (error) {
    console.warn("[data-otp] dataHotpIs failed", error);
    return false;
  }
}

/** Returns whether the account uses TOTP (time-based). */
export function dataTotpIs(account) {
  try {
    return account.type === TOTP_TYPE;
  } catch (error) {
    console.warn("[data-otp] dataTotpIs failed", error);
    return false;
  }
}
