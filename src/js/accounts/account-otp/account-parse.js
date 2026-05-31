import { DEFAULT_ALGORITHM } from "../account-constants.js";
import { HOTP_DEFAULT_COUNTER } from "../account-constants.js";
import { HOTP_TYPE } from "../account-constants.js";
import { TOTP_DIGITS } from "../account-constants.js";
import { TOTP_PERIOD } from "../account-constants.js";
import { TOTP_TYPE } from "../account-constants.js";
import { accountNameBuild } from "../account-records/account-build.js";
import { accountIssuerSanitize } from "../account-records/account-sanitize.js";
import { accountSecretSanitize } from "../account-records/account-sanitize.js";

/** Parses a scanned QR otpauth URI into account fields. */
export function accountQrParse(uri) {
  try {
    let raw = String(uri).trim();
    if (raw.toLowerCase().startsWith("apple-otpauth://")) {
      raw = `otpauth://${raw.slice("apple-otpauth://".length)}`;
    }
    const url = new URL(raw);
    const type = url.hostname.toLowerCase();
    const secret = accountSecretSanitize(url.searchParams.get("secret"));
    const digitsParam = url.searchParams.get("digits");
    const digits = digitsParam ? Number.parseInt(digitsParam, 10) : TOTP_DIGITS;
    const algorithmParam = url.searchParams.get("algorithm");
    const algorithm = algorithmParam || DEFAULT_ALGORITHM;
    const otpOptions = { type, algorithm, digits };
    if (type === HOTP_TYPE) {
      const counterParam = url.searchParams.get("counter");
      otpOptions.counter = counterParam
        ? Number.parseInt(counterParam, 10)
        : HOTP_DEFAULT_COUNTER;
    } else {
      const periodParam = url.searchParams.get("period");
      otpOptions.period = periodParam
        ? Number.parseInt(periodParam, 10)
        : TOTP_PERIOD;
    }
    const pathLabel = decodeURIComponent(url.pathname.replace(/^\//, ""));
    const colonIndex = pathLabel.indexOf(":");
    const pathIssuer =
      colonIndex !== -1 ? pathLabel.slice(0, colonIndex).trim() : "";
    const label =
      colonIndex !== -1 ? pathLabel.slice(colonIndex + 1).trim() : pathLabel;
    const issuerParam = url.searchParams.get("issuer");
    const issuer = issuerParam
      ? decodeURIComponent(issuerParam).trim()
      : pathIssuer;
    const { name, email } = accountNameBuild(issuer, label);
    const account = {
      name,
      secret,
      type,
      algorithm,
      digits,
    };
    if (type === HOTP_TYPE) {
      account.counter = otpOptions.counter;
    } else {
      account.period = otpOptions.period;
    }
    if (email) {
      account.email = email;
    }
    return account;
  } catch (error) {
    console.warn("[account-otp-parser] accountQrParse failed", error);
    throw error;
  }
}

/** Parses manual setup form fields into account fields. */
export function accountManualParse({ name, secret, email, type }) {
  try {
    const sanitizedName = accountIssuerSanitize(name);
    const sanitizedSecret = accountSecretSanitize(secret);
    const otpType = type === HOTP_TYPE ? HOTP_TYPE : TOTP_TYPE;
    const otpOptions = {
      type: otpType,
      algorithm: DEFAULT_ALGORITHM,
      digits: TOTP_DIGITS,
    };
    if (otpType === HOTP_TYPE) {
      otpOptions.counter = HOTP_DEFAULT_COUNTER;
    } else {
      otpOptions.period = TOTP_PERIOD;
    }
    const emailRaw = String(email).trim();
    const account = {
      name: sanitizedName,
      secret: sanitizedSecret,
      type: otpType,
      algorithm: otpOptions.algorithm,
      digits: otpOptions.digits,
    };
    if (otpType === HOTP_TYPE) {
      account.counter = otpOptions.counter;
    } else {
      account.period = otpOptions.period;
    }
    if (emailRaw) {
      account.email = emailRaw;
    }
    return account;
  } catch (error) {
    console.warn("[account-otp-parser] accountManualParse failed", error);
    throw error;
  }
}
