/** Active OTP account list written after cloud restore or merge. */
export const DATA_KEY_FINAL = "dataReady";

/** Cached encrypted backup blob fetched from the server. */
export const DATA_KEY_ENCRYPTED = "dataEncrypted";

/** Pending accounts queued locally before merge and upload. */
export const DATA_KEY_PENDING = "dataUnencrypted";

/** Temporary merged list used during add/update flows. */
export const DATA_KEY_MERGED = "dataMerged";

/** Legacy storage keys removed on sign-out for older extension versions. */
export const DATA_KEY_LEGACY = [
  "accountsFinal",
  "accountsEncrypted",
  "accountsUnencrypted",
  "accountsMerged",
  "accountsRestore",
  "accounts",
  "encrypted",
  "accountsAll",
];

/** OTP type string for time-based codes. */
export const DATA_OTP_TYPE_TOTP = "totp";

/** OTP type string for counter-based codes. */
export const DATA_OTP_TYPE_HOTP = "hotp";

/** Default HMAC algorithm when none is specified. */
export const DATA_OTP_ALGORITHM_DEFAULT = "SHA1";

/** Default number of digits in a generated code. */
export const DATA_OTP_DIGITS = 6;

/** Default TOTP step size in seconds. */
export const DATA_OTP_PERIOD = 30;

/** Default starting counter for new HOTP accounts. */
export const DATA_HOTP_COUNTER_DEFAULT = 0;

/** Minimum allowed HOTP counter value. */
export const DATA_COUNTER_MIN = 0;
