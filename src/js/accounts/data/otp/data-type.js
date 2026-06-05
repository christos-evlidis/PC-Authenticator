import { DATA_OTP_TYPE_HOTP } from "../data-constants.js";
import { DATA_OTP_TYPE_TOTP } from "../data-constants.js";

/** Returns whether the account uses HOTP (counter-based). */
export function dataOtpIsHotp(account) {
  try {
    return account.type === DATA_OTP_TYPE_HOTP;
  } catch (error) {
    console.warn("[data-otp] dataOtpIsHotp failed", error);
    return false;
  }
}

/** Returns whether the account uses TOTP (time-based). */
export function dataOtpIsTotp(account) {
  try {
    return account.type === DATA_OTP_TYPE_TOTP;
  } catch (error) {
    console.warn("[data-otp] dataOtpIsTotp failed", error);
    return false;
  }
}
