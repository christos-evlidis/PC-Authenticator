export const AUTH_API_BASE_URL = "https://pc-authenticator-pdpy.onrender.com/api";
export const AUTH_NUMBER_KEY = "accountNumber";
export const AUTH_NUMBER_LENGTH = 24;

export const DATA_KEY_FINAL = "dataReady";
export const DATA_KEY_PENDING = "dataPending";
export const DATA_KEY_RESTORED = "restored";
export const DATA_KEY_MERGED = "merged";

export const DATA_KEY_LEGACY = [
  "dataManual",
  "dataSync",
  "dataEncrypted",
  "dataUnencrypted",
  "restoredEncrypted",
  "restoredUnencrypted",
  "dataFinal",
  "accountsFinal",
  "accountsEncrypted",
  "accountsUnencrypted",
  "merged",
  "restored",
  "accounts",
  "encrypted",
  "accountsAll",
];

export const DATA_OTP_TYPE_TOTP = "totp";
export const DATA_OTP_TYPE_HOTP = "hotp";
export const DATA_OTP_ALGORITHM_DEFAULT = "SHA1";
export const DATA_OTP_DIGITS = 6;
export const DATA_OTP_PERIOD = 30;
export const DATA_HOTP_COUNTER_DEFAULT = 0;
export const DATA_COUNTER_MIN = 0;
