import { authStorageGet } from "../../../../accounts/accounts-index.js";
import { dataStorageReadyGet } from "../../../../accounts/accounts-index.js";
import { authChromeApply } from "../../../../utils/utility-auth.js";
import { scanPendingGet } from "../../../../scan/scan-index.js";

/** Restores signed-in chrome when a pending scan exists on load. */
async function qrSetupHandleResume() {
  try {
    const pending = await scanPendingGet();

    if (pending?.status !== "ready" && pending?.status !== "error") {
      return false;
    }

    const authNumber = await authStorageGet();

    if (!authNumber) {
      return false;
    }

    const stored = await dataStorageReadyGet();
    const hasAccounts = Array.isArray(stored) && stored.length > 0;

    await authChromeApply({
      authNumber,
      isSignedIn: true,
      hasAccounts,
    });

    return true;
  } catch (error) {
    console.warn("[qr-setup] qrSetupHandleResume failed", error);
    return false;
  }
}

export { qrSetupHandleResume };
