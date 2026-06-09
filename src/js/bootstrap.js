import { authStorageGet } from "./accounts/accounts-index.js";
import { authApiVerify } from "./accounts/accounts-index.js";
import { dataHandleSync } from "./accounts/accounts-index.js";
import { authChromeApply } from "./utils/utility-auth.js";

/** Verifies stored auth, syncs data from API, and applies chrome. */
async function bootstrap() {
  const authNumber = await authStorageGet();

  if (!authNumber) {
    await authChromeApply({ authNumber: null, isSignedIn: false });
    return { isSignedIn: false };
  } else {
    const verifyResult = await authApiVerify(authNumber);
    if (verifyResult?.success !== true) {
      throw new Error("Account verification failed");
    }
    const accounts = await dataHandleSync(authNumber);
    const hasAccounts = accounts.length > 0;

    await authChromeApply({ authNumber, isSignedIn: true, hasAccounts });
    return { isSignedIn: true, hasAccounts };
  }
}

export { bootstrap };
