import { DATA_OTP_TYPE_HOTP } from "../../constants.js";
import { DATA_OTP_PERIOD } from "../../constants.js";

/** Resolves the HMAC counter: HOTP uses stored counter, TOTP uses current time step. */
function dataCodeCounter(options) {
  try {
    if (options.type === DATA_OTP_TYPE_HOTP) {
      return options.counter;
    }
    const period = options.period;
    if (!period || period < 1) {
      console.warn(
        "[data-code] dataCodeCounter: invalid period, using default",
        options.period,
      );
      return Math.floor(Date.now() / 1000 / DATA_OTP_PERIOD);
    }
    const epochSec = Math.floor(Date.now() / 1000);
    return Math.floor(epochSec / period);
  } catch (error) {
    console.warn("[data-code] dataCodeCounter failed", error);
    return 0;
  }
}

export { dataCodeCounter };
