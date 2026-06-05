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
    await dataSync(authNumber);
    await authChromeApply({ authNumber, isSignedIn: true });
    return { isSignedIn: true };
  }
}

export { bootstrap };
