export const DATA_KEY_FINAL = "dataReady";

export const DATA_KEY_ENCRYPTED = "dataEncrypted";

export const DATA_KEY_PENDING = "dataUnencrypted";

export const DATA_KEY_MERGED = "dataMerged";

export const DATA_KEY_LEGACY_FINAL = "accountsFinal";

export const DATA_KEY_LEGACY_ENCRYPTED = "accountsEncrypted";

export const DATA_KEY_LEGACY_PENDING = "accountsUnencrypted";

export const DATA_KEY_LEGACY_MERGED = "accountsMerged";

export const DATA_KEY_LEGACY = [
  DATA_KEY_LEGACY_FINAL,
  DATA_KEY_LEGACY_ENCRYPTED,
  DATA_KEY_LEGACY_PENDING,
  DATA_KEY_LEGACY_MERGED,
  "accountsRestore",
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
