import { authNumberGet } from "./accounts/accounts-index.js";
import { authVerify } from "./accounts/accounts-index.js";
import { dataSync } from "./accounts/accounts-index.js";
import { refreshAuth } from "./utils/utility-auth.js";

/** Verifies stored auth, syncs data from API, and applies chrome. */
export async function bootstrap() {
  const authNumber = await authNumberGet();

  if (!authNumber) {
    await refreshAuth({ authNumber: null, isSignedIn: false });
    return { isSignedIn: false };
  } else {
    const verifyResult = await authVerify(authNumber);
    if (verifyResult?.success !== true) {
      throw new Error("Account verification failed");
    }
    await dataSync(authNumber);
    await refreshAuth({ authNumber, isSignedIn: true });
    return { isSignedIn: true };
  }
}
