import { authChromeApply } from "../../../../utils/utility-auth.js";
import { authStorageGet } from "../../../../accounts/auth/storage/get.js";
import { dataStorageReadyGet } from "../../../../accounts/data/storage/ready/get.js";
import { scanPendingGet } from "../../../../scan/scan-index.js";

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
