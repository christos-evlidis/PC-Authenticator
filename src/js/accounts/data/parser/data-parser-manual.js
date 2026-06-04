import { DEFAULT_ALGORITHM } from "../data-constants.js";
import { HOTP_DEFAULT_COUNTER } from "../data-constants.js";
import { HOTP_TYPE } from "../data-constants.js";
import { TOTP_DIGITS } from "../data-constants.js";
import { TOTP_PERIOD } from "../data-constants.js";
import { TOTP_TYPE } from "../data-constants.js";
import { dataIssuerSanitize } from "../records/data-sanitize.js";
import { dataSecretSanitize } from "../records/data-sanitize.js";

/** Parses manual setup form fields into account fields. */
export function dataManualParse({ name, secret, email, type }) {
  try {
    const sanitizedName = dataIssuerSanitize(name);
    const sanitizedSecret = dataSecretSanitize(secret);
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
    console.warn("[data-parser-manual] dataManualParse failed", error);
    throw error;
  }
}
