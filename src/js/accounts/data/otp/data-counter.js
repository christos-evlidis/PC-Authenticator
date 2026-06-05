import { DATA_OTP_TYPE_HOTP } from "../data-constants.js";
import { DATA_OTP_PERIOD } from "../data-constants.js";

/** Resolves the HMAC counter: HOTP uses stored counter, TOTP uses current time step. */
function dataOtpGetCounter(options) {
  try {
    if (options.type === DATA_OTP_TYPE_HOTP) {
      return options.counter;
    }
    const period = options.period;
    if (!period || period < 1) {
      console.warn(
        "[data-otp-options] dataOtpGetCounter: invalid period, using default",
        options.period,
      );
      return Math.floor(Date.now() / 1000 / DATA_OTP_PERIOD);
    }
    const epochSec = Math.floor(Date.now() / 1000);
    return Math.floor(epochSec / period);
  } catch (error) {
    console.warn("[data-otp-options] dataOtpGetCounter failed", error);
    return 0;
  }
}

export { dataOtpGetCounter };
