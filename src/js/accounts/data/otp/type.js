import { DATA_OTP_TYPE_HOTP } from "../constants.js";
import { DATA_OTP_TYPE_TOTP } from "../constants.js";

/** Returns whether the account uses HOTP (counter-based). */
function dataIsHotp(account) {
  try {
    return account.type === DATA_OTP_TYPE_HOTP;
  } catch (error) {
    console.warn("[data-otp] dataIsHotp failed", error);
    return false;
  }
}

/** Returns whether the account uses TOTP (time-based). */
function dataIsTotp(account) {
  try {
    return account.type === DATA_OTP_TYPE_TOTP;
  } catch (error) {
    console.warn("[data-otp] dataIsTotp failed", error);
    return false;
  }
}

export { dataIsHotp };
export { dataIsTotp };
