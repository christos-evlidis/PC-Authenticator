/** Coerces backup/pending/restore payloads into an account array. */
export function accountListSanitize(value) {
  if (value == null) {
    return [];
  }
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === "object") {
    if (Array.isArray(value.accounts)) {
      return value.accounts;
    }
    if (Array.isArray(value.data)) {
      return value.data;
    }
    if (value.data != null && Array.isArray(value.data.accounts)) {
      return value.data.accounts;
    }
    if (value.id != null) {
      return [value];
    }
  }
  return [];
}

/** Strips whitespace and padding, then uppercases a base32 OTP secret. */
export function accountSecretSanitize(raw) {
  return String(raw)
    .trim()
    .replace(/\s+/g, "")
    .replace(/=+$/, "")
    .toUpperCase();
}

/** Trims control characters and caps display names at 64 characters. */
export function accountNameSanitize(name) {
  const trimmed = String(name)
    .trim()
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
  return Array.from(trimmed).slice(0, 64).join("").trim();
}

/** Title-cases each word of an issuer or manual account name. */
export function accountIssuerSanitize(issuer) {
  const sanitized = accountNameSanitize(issuer);
  if (!sanitized) {
    return "";
  }
  return sanitized
    .split(/\s+/)
    .map((word) => {
      const chars = Array.from(word);
      if (!chars.length) {
        return "";
      }
      return (
        chars[0].toLocaleUpperCase() +
        chars.slice(1).join("").toLocaleLowerCase()
      );
    })
    .filter(Boolean)
    .join(" ");
}
