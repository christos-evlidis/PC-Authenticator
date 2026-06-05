import { DATA_OTP_ALGORITHM_DEFAULT } from "../data-constants.js";
import { DATA_HOTP_COUNTER_DEFAULT } from "../data-constants.js";
import { DATA_OTP_TYPE_HOTP } from "../data-constants.js";
import { DATA_OTP_DIGITS } from "../data-constants.js";
import { DATA_OTP_PERIOD } from "../data-constants.js";
import { DATA_OTP_TYPE_TOTP } from "../data-constants.js";
import { dataSanitizeIssuer } from "../records/data-sanitize.js";
import { dataSanitizeSecret } from "../records/data-sanitize.js";

/** Parses manual setup form fields into account fields. */
export function dataParserManual({ name, secret, email, type }) {
  try {
    const sanitizedName = dataSanitizeIssuer(name);
    const sanitizedSecret = dataSanitizeSecret(secret);
    const otpType = type === DATA_OTP_TYPE_HOTP ? DATA_OTP_TYPE_HOTP : DATA_OTP_TYPE_TOTP;
    const otpOptions = {
      type: otpType,
      algorithm: DATA_OTP_ALGORITHM_DEFAULT,
      digits: DATA_OTP_DIGITS,
    };
    if (otpType === DATA_OTP_TYPE_HOTP) {
      otpOptions.counter = DATA_HOTP_COUNTER_DEFAULT;
    } else {
      otpOptions.period = DATA_OTP_PERIOD;
    }
    const emailRaw = String(email).trim();
    const account = {
      name: sanitizedName,
      secret: sanitizedSecret,
      type: otpType,
      algorithm: otpOptions.algorithm,
      digits: otpOptions.digits,
    };
    if (otpType === DATA_OTP_TYPE_HOTP) {
      account.counter = otpOptions.counter;
    } else {
      account.period = otpOptions.period;
    }
    if (emailRaw) {
      account.email = emailRaw;
    }
    return account;
  } catch (error) {
    console.warn("[data-parser-manual] dataParserManual failed", error);
    throw error;
  }
}
