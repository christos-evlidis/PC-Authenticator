import { DEFAULT_ALGORITHM } from "../account-constants.js";
import { HOTP_DEFAULT_COUNTER } from "../account-constants.js";
import { HOTP_TYPE } from "../account-constants.js";
import { TOTP_DIGITS } from "../account-constants.js";
import { TOTP_PERIOD } from "../account-constants.js";
import { TOTP_TYPE } from "../account-constants.js";
import { accountNameSanitize } from "./account-sanitize.js";
import { accountIssuerSanitize } from "./account-sanitize.js";

/** Builds display name and optional email from issuer and label. */
export function accountNameBuild(issuer, label) {
  const issuerText = accountIssuerSanitize(issuer);
  const labelText = accountNameSanitize(label);
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
  name = accountNameSanitize(name);
  return { name, email };
}

/** Turns parsed OTP fields into a storable account object. */
export function accountFinalBuild({
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
    const otpType = type ?? TOTP_TYPE;
    const account = {
      id: String(Date.now()),
      name,
      secret,
      type: otpType,
      algorithm: algorithm ?? DEFAULT_ALGORITHM,
      digits: digits ?? TOTP_DIGITS,
    };
    if (otpType === HOTP_TYPE) {
      account.counter = counter ?? HOTP_DEFAULT_COUNTER;
    } else {
      account.period = period ?? TOTP_PERIOD;
    }
    if (email) {
      account.email = email;
    }
    return account;
  } catch (error) {
    console.warn("[account-records] accountFinalBuild failed", error);
    throw error;
  }
}
