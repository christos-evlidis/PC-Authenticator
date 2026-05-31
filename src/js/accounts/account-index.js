import { HOTP_DEFAULT_COUNTER } from "./account-constants.js";
import { MIN_COUNTER } from "./account-constants.js";
import { TOTP_DIGITS } from "./account-constants.js";
import { accountOtpClockGet } from "./account-otp/account-clock.js";
import { accountOtpNumberGet } from "./account-otp/account-generate.js";
import { accountOtpOptionsGet } from "./account-otp/account-options.js";
import { accountHotpIs } from "./account-otp/account-type.js";
import { accountTotpIs } from "./account-otp/account-type.js";

export { accountVerify } from "./account-api.js";
export { accountCreate } from "./account-api.js";
export { accountManualAdd } from "./account-actions/account-add.js";
export { accountQrAdd } from "./account-actions/account-add.js";
export { accountDelete } from "./account-actions/account-delete.js";
export { accountUpdate } from "./account-actions/account-update.js";
export { accountSync } from "./account-backup/account-sync.js";
export { accountsClear } from "./account-storage.js";
export { accountsFinalGet } from "./account-storage.js";

/** Bundles OTP constants and helpers for the codes UI. */
export function accountOtpApiCreate() {
  try {
    return {
      TOTP_DIGITS,
      HOTP_DEFAULT_COUNTER,
      MIN_COUNTER,
      accountHotpIs,
      accountTotpIs,
      accountOtpOptionsGet,
      accountOtpNumberGet,
      accountOtpClockGet,
    };
  } catch (error) {
    console.warn("[account-index] accountOtpApiCreate failed", error);
    throw error;
  }
}
