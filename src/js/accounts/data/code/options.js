import { DATA_OTP_TYPE_HOTP } from "../../constants.js";

/** Builds the option object passed into code generation for a stored account. */
function dataCodeOptions(account) {
  try {
    const options = {
      type: account.type,
      algorithm: account.algorithm,
      digits: account.digits,
    };
    if (account.type === DATA_OTP_TYPE_HOTP) {
      options.counter = account.counter;
    } else {
      options.period = account.period;
    }
    return options;
  } catch (error) {
    console.warn("[data-code] dataCodeOptions failed", error);
    throw error;
  }
}

export { dataCodeOptions };
