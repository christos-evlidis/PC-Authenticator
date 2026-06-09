import { dataSanitizeIssuer } from "./sanitize.js";
import { dataSanitizeName } from "./sanitize.js";

import { DATA_OTP_ALGORITHM_DEFAULT } from "../constants.js";
import { DATA_HOTP_COUNTER_DEFAULT } from "../constants.js";
import { DATA_OTP_TYPE_HOTP } from "../constants.js";
import { DATA_OTP_DIGITS } from "../constants.js";
import { DATA_OTP_PERIOD } from "../constants.js";
import { DATA_OTP_TYPE_TOTP } from "../constants.js";

/** Builds display name and optional email from issuer and label. */
function dataBuildName(issuer, label) {
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
function dataBuildFinal({
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

export { dataBuildName };
export { dataBuildFinal };
