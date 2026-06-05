import { cross } from "../sections/section-cross.js";
import {
  AUTH_NUMBER_LENGTH,
  authNumberClear,
  authNumberGet,
  authSanitize,
  authVerify,
} from "../accounts/accounts-index.js";

let verifiedAuthNumberCache = { value: undefined, storageSnapshot: undefined };

/** Loads storage, verifies with the server, and returns a valid auth number or null. */
async function authNumberResolve() {
  const stored = await authNumberGet();

  if (
    verifiedAuthNumberCache.storageSnapshot === stored &&
    verifiedAuthNumberCache.value !== undefined
  ) {
    return verifiedAuthNumberCache.value;
  }

  let authNumber = null;

  if (stored) {
    const sanitized = authSanitize(stored);
    if (sanitized.length === AUTH_NUMBER_LENGTH && sanitized === stored) {
      try {
        const result = await authVerify(sanitized);
        if (result?.success === true) {
          authNumber = sanitized;
        } else {
          await authNumberClear();
        }
      } catch {
        authNumber = null;
      }
    } else {
      await authNumberClear();
    }
  }

  verifiedAuthNumberCache = {
    value: authNumber,
    storageSnapshot: authNumber ? stored : null,
  };
  return authNumber;
}

/** Clears the in-memory verified-auth cache after sign-in, sign-up, or sign-out. */
export function authNumberVerifyCacheClear() {
  verifiedAuthNumberCache = { value: undefined, storageSnapshot: undefined };
}

/** Returns the verified auth number, or null when absent or invalid. */
export async function getVerifiedAuthNumber() {
  return authNumberResolve();
}

/** Verifies storage, then applies signed-in/out state to header, body, and user menu. */
export async function refreshAuth(preverifiedAuthNumber) {
  const authNumber =
    preverifiedAuthNumber !== undefined
      ? preverifiedAuthNumber
      : await authNumberResolve();
  const isSignedIn = Boolean(authNumber);

  cross.header?.apply(isSignedIn);
  cross.body?.apply(isSignedIn);

  if (isSignedIn) {
    cross.userMenu?.apply(true, authNumber);
  } else {
    cross.userMenu?.apply(false);
  }
}
