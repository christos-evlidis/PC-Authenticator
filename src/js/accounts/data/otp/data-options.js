import { HOTP_TYPE } from "../data-constants.js";

/** Builds the option object passed into OTP generation for a stored account. */
export function dataOtpOptionsGet(account) {
  try {
    const options = {
      type: account.type,
      algorithm: account.algorithm,
      digits: account.digits,
    };
    if (account.type === HOTP_TYPE) {
      options.counter = account.counter;
    } else {
      options.period = account.period;
    }
    return options;
  } catch (error) {
    console.warn("[data-otp-options] dataOtpOptionsGet failed", error);
    throw error;
  }
}
