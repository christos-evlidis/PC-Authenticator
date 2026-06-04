import { DEFAULT_ALGORITHM } from "../account-constants.js";
import { HOTP_DEFAULT_COUNTER } from "../account-constants.js";
import { HOTP_TYPE } from "../account-constants.js";
import { TOTP_DIGITS } from "../account-constants.js";
import { TOTP_PERIOD } from "../account-constants.js";
import { TOTP_TYPE } from "../account-constants.js";
import { accountIssuerSanitize } from "../account-records/account-sanitize.js";
import { accountSecretSanitize } from "../account-records/account-sanitize.js";

/** Parses manual setup form fields into account fields. */
export function accountManualParse({ name, secret, email, type }) {
  try {
    const sanitizedName = accountIssuerSanitize(name);
    const sanitizedSecret = accountSecretSanitize(secret);
    const otpType = type === HOTP_TYPE ? HOTP_TYPE : TOTP_TYPE;
    const otpOptions = {
      type: otpType,
      algorithm: DEFAULT_ALGORITHM,
      digits: TOTP_DIGITS,
    };
    if (otpType === HOTP_TYPE) {
      otpOptions.counter = HOTP_DEFAULT_COUNTER;
    } else {
      otpOptions.period = TOTP_PERIOD;
    }
    const emailRaw = String(email).trim();
    const account = {
      name: sanitizedName,
      secret: sanitizedSecret,
      type: otpType,
      algorithm: otpOptions.algorithm,
      digits: otpOptions.digits,
    };
    if (otpType === HOTP_TYPE) {
      account.counter = otpOptions.counter;
    } else {
      account.period = otpOptions.period;
    }
    if (emailRaw) {
      account.email = emailRaw;
    }
    return account;
  } catch (error) {
    console.warn("[parser-manual] accountManualParse failed", error);
    throw error;
  }
}
