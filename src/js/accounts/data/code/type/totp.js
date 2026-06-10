import { DATA_OTP_TYPE_TOTP } from "../../../accounts-const.js";

/** Returns whether the account uses TOTP. */
function dataCodeTypeTotp(account) {
  try {
    return account.type === DATA_OTP_TYPE_TOTP;
  } catch (error) {
    console.warn("[data-code] dataCodeTypeTotp failed", error);
    return false;
  }
}

export { dataCodeTypeTotp };
