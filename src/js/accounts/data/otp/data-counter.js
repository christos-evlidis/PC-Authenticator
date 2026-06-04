import { HOTP_TYPE } from "../data-constants.js";
import { TOTP_PERIOD } from "../data-constants.js";

/** Resolves the HMAC counter: HOTP uses stored counter, TOTP uses current time step. */
export function dataOtpCounterGet(options) {
  try {
    if (options.type === HOTP_TYPE) {
      return options.counter;
    }
    const period = options.period;
    if (!period || period < 1) {
      console.warn(
        "[data-otp-options] dataOtpCounterGet: invalid period, using default",
        options.period,
      );
      return Math.floor(Date.now() / 1000 / TOTP_PERIOD);
    }
    const epochSec = Math.floor(Date.now() / 1000);
    return Math.floor(epochSec / period);
  } catch (error) {
    console.warn("[data-otp-options] dataOtpCounterGet failed", error);
    return 0;
  }
}
