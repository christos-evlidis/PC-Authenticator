import { authNumberGet } from "./accounts/accounts-index.js";
import { authVerify } from "./accounts/accounts-index.js";
import { dataSync } from "./accounts/accounts-index.js";
import { authChromeApply } from "./utils/utility-auth.js";

/** Verifies stored auth, syncs data from API, and applies chrome. */
async function bootstrap() {
  const authNumber = await authNumberGet();

  if (!authNumber) {
    await authChromeApply({ authNumber: null, isSignedIn: false });
    return { isSignedIn: false };
  } else {
    const verifyResult = await authVerify(authNumber);
    if (verifyResult?.success !== true) {
      throw new Error("Account verification failed");
    }
    const accounts = await dataSync(authNumber);
    const hasAccounts = accounts.length > 0;

    await authChromeApply({ authNumber, isSignedIn: true, hasAccounts });
    return { isSignedIn: true, hasAccounts };
  }
}

export { bootstrap };
