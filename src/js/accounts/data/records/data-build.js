import { DEFAULT_ALGORITHM } from "../data-constants.js";
import { HOTP_DEFAULT_COUNTER } from "../data-constants.js";
import { HOTP_TYPE } from "../data-constants.js";
import { TOTP_DIGITS } from "../data-constants.js";
import { TOTP_PERIOD } from "../data-constants.js";
import { TOTP_TYPE } from "../data-constants.js";
import { dataIssuerSanitize } from "./data-sanitize.js";
import { dataNameSanitize } from "./data-sanitize.js";

/** Builds display name and optional email from issuer and label. */
export function dataNameBuild(issuer, label) {
  try {
    const issuerText = dataIssuerSanitize(issuer);
    const labelText = dataNameSanitize(label);
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
    name = dataNameSanitize(name);
    return { name, email };
  } catch (error) {
    console.warn("[data-records] dataNameBuild failed", error);
    throw error;
  }
}

/** Turns parsed OTP fields into a storable account object. */
export function dataFinalBuild({
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
    console.warn("[data-records] dataFinalBuild failed", error);
    throw error;
  }
}
