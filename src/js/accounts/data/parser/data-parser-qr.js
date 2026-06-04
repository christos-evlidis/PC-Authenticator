import { DEFAULT_ALGORITHM } from "../data-constants.js";
import { HOTP_DEFAULT_COUNTER } from "../data-constants.js";
import { HOTP_TYPE } from "../data-constants.js";
import { TOTP_DIGITS } from "../data-constants.js";
import { TOTP_PERIOD } from "../data-constants.js";
import { dataNameBuild } from "../records/data-build.js";
import { dataSecretSanitize } from "../records/data-sanitize.js";

/** Parses a scanned QR otpauth URI into account fields. */
export function dataQrParse(uri) {
  try {
    let raw = String(uri).trim();
    if (raw.toLowerCase().startsWith("apple-otpauth://")) {
      raw = `otpauth://${raw.slice("apple-otpauth://".length)}`;
    }
    const url = new URL(raw);
    const type = url.hostname.toLowerCase();
    const secret = dataSecretSanitize(url.searchParams.get("secret"));
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
    const { name, email } = dataNameBuild(issuer, label);
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
    console.warn("[data-parser-qr] dataQrParse failed", error);
    throw error;
  }
}
