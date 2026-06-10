import { DATA_HOTP_COUNTER_DEFAULT } from "../../../accounts-const.js";
import { DATA_OTP_ALGORITHM_DEFAULT } from "../../../accounts-const.js";
import { DATA_OTP_DIGITS } from "../../../accounts-const.js";
import { DATA_OTP_PERIOD } from "../../../accounts-const.js";
import { DATA_OTP_TYPE_HOTP } from "../../../accounts-const.js";
import { DATA_OTP_TYPE_TOTP } from "../../../accounts-const.js";

/** Assigns ID and defaults to build a final account record. */
function dataRecordBuildFinal({
  name,
  secret,
  email,
  algorithm,
  digits,
  period,
  type,
  counter,
}) {
  try {
    const otpType = type ?? DATA_OTP_TYPE_TOTP;
    const account = {
      id: String(Date.now()),
      name,
      secret,
      type: otpType,
      algorithm: algorithm ?? DATA_OTP_ALGORITHM_DEFAULT,
      digits: digits ?? DATA_OTP_DIGITS,
    };
    if (otpType === DATA_OTP_TYPE_HOTP) {
      account.counter = counter ?? DATA_HOTP_COUNTER_DEFAULT;
    } else {
      account.period = period ?? DATA_OTP_PERIOD;
    }
    if (email) {
      account.email = email;
    }
    return account;
  } catch (error) {
    console.warn("[data-record] dataRecordBuildFinal failed", error);
    throw error;
  }
}

export { dataRecordBuildFinal };
