import { DATA_OTP_TYPE_HOTP } from "../../../constants.js";

function dataCodeTypeHotp(account) {
  try {
    return account.type === DATA_OTP_TYPE_HOTP;
  } catch (error) {
    console.warn("[data-code] dataCodeTypeHotp failed", error);
    return false;
  }
}

export { dataCodeTypeHotp };
