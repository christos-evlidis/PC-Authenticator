import { DATA_OTP_ALGORITHM_DEFAULT } from "../data-constants.js";
import { DATA_HOTP_COUNTER_DEFAULT } from "../data-constants.js";
import { DATA_OTP_TYPE_HOTP } from "../data-constants.js";
import { DATA_OTP_DIGITS } from "../data-constants.js";
import { DATA_OTP_PERIOD } from "../data-constants.js";
import { DATA_OTP_TYPE_TOTP } from "../data-constants.js";
import { dataSanitizeIssuer } from "./data-sanitize.js";
import { dataSanitizeName } from "./data-sanitize.js";

/** Builds display name and optional email from issuer and label. */
export function dataBuildName(issuer, label) {
  try {
    const issuerText = dataSanitizeIssuer(issuer);
    const labelText = dataSanitizeName(label);
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    let name = issuerText;
    let email = "";
    if (labelText) {
      if (emailPattern.test(labelText)) {
        email = labelText;
        name = issuerText || labelText.split("@")[0];
      } else if (issuerText) {
        name = `${issuerText} (${labelText})`;
      } else {
        name = labelText;
      }
    }
    name = dataSanitizeName(name);
    return { name, email };
  } catch (error) {
    console.warn("[data-records] dataBuildName failed", error);
    throw error;
  }
}

/** Turns parsed OTP fields into a storable account object. */
export function dataBuildFinal({
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
    console.warn("[data-records] dataBuildFinal failed", error);
    throw error;
  }
}
